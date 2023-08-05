import os
import requests
from collections import defaultdict
from datetime import datetime, timedelta
import pandas as pd


def count_hours(start, end):
    total_hours = (end - start).seconds / 3600 + (end - start).days * 24
    return total_hours


def week_ending_date(date):
    return date + timedelta(days=(6-date.weekday()))


def fetch_pulls(repo, headers):
    pulls = []
    page = 1
    while True:
        response = requests.get(f"https://api.github.com/repos/{repo}/pulls?state=closed&page={page}&per_page=100", headers=headers)
        data = response.json()
        if not data:
            break
        pulls.extend(data)
        page += 1
    return pulls


def fetch_reviews(pull_number, repo, headers):
    response = requests.get(f"https://api.github.com/repos/{repo}/pulls/{pull_number}/reviews", headers=headers)
    return response.json()


def process_pull_data(pull, daily_data, weekly_data, repo, headers):
    if pull['base']['ref'] != 'develop':
        return

    closed_at = datetime.strptime(pull['closed_at'], '%Y-%m-%dT%H:%M:%SZ')
    created_at = datetime.strptime(pull['created_at'], '%Y-%m-%dT%H:%M:%SZ')
    creator = pull['user']['login']

    reviews = fetch_reviews(pull['number'], repo, headers)

    first_review_time = None
    approver = None
    for review in reviews:
        if review['state'] in ['APPROVED', 'CHANGES_REQUESTED']:
            first_review_time = datetime.strptime(review['submitted_at'], '%Y-%m-%dT%H:%M:%SZ')
            approver = review['user']['login']
            break

    # Process daily data
    day = closed_at.date()
    if first_review_time:
        daily_data[day]['Open to Review Start'].append(count_hours(created_at, first_review_time))
        daily_data[day]['Review Start to Merge'].append(count_hours(first_review_time, closed_at))
    daily_data[day]['Open to Merge'].append(count_hours(created_at, closed_at))
    daily_data[day]['Number of PRs'] += 1
    daily_data[day]['Creators'][creator] += 1
    if approver:
        daily_data[day]['Approvers'][approver] += 1

    # Process weekly data
    week_end = week_ending_date(closed_at.date())
    if first_review_time:
        weekly_data[week_end]['Open to Review Start'].append(count_hours(created_at, first_review_time))
        weekly_data[week_end]['Review Start to Merge'].append(count_hours(first_review_time, closed_at))
    weekly_data[week_end]['Open to Merge'].append(count_hours(created_at, closed_at))
    weekly_data[week_end]['Number of PRs'] += 1
    weekly_data[week_end]['Creators'][creator] += 1
    if approver:
        weekly_data[week_end]['Approvers'][approver] += 1


def get_data_row(data, key, is_daily=True):
    if is_daily:
        day_string = key.strftime('%Y-%m-%d')
        avg_open_to_merge = sum(data['Open to Merge']) / len(data['Open to Merge']) if data['Open to Merge'] else 0
        avg_open_to_review = sum(data['Open to Review Start']) / len(data['Open to Review Start']) if data['Open to Review Start'] else 0
        avg_review_to_merge = sum(data['Review Start to Merge']) / len(data['Review Start to Merge']) if data['Review Start to Merge'] else 0

        creators_str = "\n".join([f"{name}: {count} PRs" for name, count in data['Creators'].items()])
        approvers_str = "\n".join([f"{name}: {count} approvals" for name, count in data['Approvers'].items()])

        return {
            'Date': day_string,
            'Open to Merge': avg_open_to_merge,
            'Open to Review Start': avg_open_to_review,
            'Review Start to Merge': avg_review_to_merge,
            'Number of PRs': data['Number of PRs'],
            'PR Creators': creators_str,
            'PR Approvers': approvers_str
        }

    else:
        week_start_str = (key - timedelta(days=6)).strftime('%Y-%m-%d')
        week_end_str = key.strftime('%Y-%m-%d')
        week_string = f"{week_start_str} to {week_end_str}"
        avg_open_to_merge = sum(data['Open to Merge']) / len(data['Open to Merge']) if data['Open to Merge'] else 0
        avg_open_to_review = sum(data['Open to Review Start']) / len(data['Open to Review Start']) if data['Open to Review Start'] else 0
        avg_review_to_merge = sum(data['Review Start to Merge']) / len(data['Review Start to Merge']) if data['Review Start to Merge'] else 0

        creators_str = "\n".join([f"{name}: {count} PRs" for name, count in data['Creators'].items()])
        approvers_str = "\n".join([f"{name}: {count} approvals" for name, count in data['Approvers'].items()])

        return {
            'Week': week_string,
            'Open to Merge': avg_open_to_merge,
            'Open to Review Start': avg_open_to_review,
            'Review Start to Merge': avg_review_to_merge,
            'Number of PRs': data['Number of PRs'],
            'PR Creators': creators_str,
            'PR Approvers': approvers_str
        }


def write_to_html(all_daily_data, all_weekly_data):
    df_daily = pd.DataFrame(all_daily_data)
    df_weekly = pd.DataFrame(all_weekly_data)
    with open('results.html', 'w') as f:
        f.write("<h2>Daily Data</h2>")
        f.write(df_daily.to_html(index=False))
        f.write("<h2>Weekly Data</h2>")
        f.write(df_weekly.to_html(index=False))


if __name__ == "__main__":
    start_date = datetime(2023, 7, 1).date()
    token = os.getenv('MY_GITHUB_TOKEN')
    headers = {'Authorization': f'token {token}'}
    repo = "shimapon/fgo-apps"
    pulls = fetch_pulls(repo, headers)

    daily_data = defaultdict(lambda: {
        'Open to Merge': [],
        'Open to Review Start': [],
        'Review Start to Merge': [],
        'Number of PRs': 0,
        'Creators': defaultdict(int),
        'Approvers': defaultdict(int)
    })

    weekly_data = defaultdict(lambda: {
        'Open to Merge': [],
        'Open to Review Start': [],
        'Review Start to Merge': [],
        'Number of PRs': 0,
        'Creators': defaultdict(int),
        'Approvers': defaultdict(int)
    })

    for pull in pulls:
        process_pull_data(pull, daily_data, weekly_data, repo, headers)

    all_daily_data = [get_data_row(data, key) for key, data in daily_data.items()]
    all_weekly_data = [get_data_row(data, key, is_daily=False) for key, data in weekly_data.items()]

    write_to_html(all_daily_data, all_weekly_data)
