import os
import requests
from collections import defaultdict
from datetime import datetime, timedelta
import pandas as pd

def count_hours(start, end):
    total_hours = (end - start).seconds / 3600 + (end - start).days * 24
    return total_hours

def week_ending_date(date):
    # Returns the ending date (Sunday) for the week in which the given date falls.
    return date + timedelta(days=(6-date.weekday()))

start_date = datetime(2023, 7, 1).date()

token = os.getenv('MY_GITHUB_TOKEN')
headers = {'Authorization': f'token {token}'}
repo = "shimapon/fgo-apps"

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

page = 1
pulls = []
while True:
    response = requests.get(f"https://api.github.com/repos/{repo}/pulls?state=closed&page={page}&per_page=100", headers=headers)
    data = response.json()
    if not data:
        break
    pulls.extend(data)
    page += 1

for pull in pulls:
    if pull['base']['ref'] != 'develop':
        continue
    closed_at = datetime.strptime(pull['closed_at'], '%Y-%m-%dT%H:%M:%SZ')
    created_at = datetime.strptime(pull['created_at'], '%Y-%m-%dT%H:%M:%SZ')
    creator = pull['user']['login']
    
    pull_number = pull['number']
    response = requests.get(f"https://api.github.com/repos/{repo}/pulls/{pull_number}/reviews", headers=headers)
    reviews = response.json()

    first_review_time = None
    approver = None
    for review in reviews:
        if review['state'] in ['APPROVED', 'CHANGES_REQUESTED']:
            first_review_time = datetime.strptime(review['submitted_at'], '%Y-%m-%dT%H:%M:%SZ')
            approver = review['user']['login']
            break

    # Daily Data
    day = closed_at.date()
    if first_review_time:
        daily_data[day]['Open to Review Start'].append(count_hours(created_at, first_review_time))
        daily_data[day]['Review Start to Merge'].append(count_hours(first_review_time, closed_at))
    daily_data[day]['Open to Merge'].append(count_hours(created_at, closed_at))
    daily_data[day]['Number of PRs'] += 1
    daily_data[day]['Creators'][creator] += 1
    if approver:
        daily_data[day]['Approvers'][approver] += 1

    # Weekly Data
    week_end = week_ending_date(closed_at.date())
    if first_review_time:
        weekly_data[week_end]['Open to Review Start'].append(count_hours(created_at, first_review_time))
        weekly_data[week_end]['Review Start to Merge'].append(count_hours(first_review_time, closed_at))
    weekly_data[week_end]['Open to Merge'].append(count_hours(created_at, closed_at))
    weekly_data[week_end]['Number of PRs'] += 1
    weekly_data[week_end]['Creators'][creator] += 1
    if approver:
        weekly_data[week_end]['Approvers'][approver] += 1

all_daily_data = []
current_date = start_date
while current_date <= datetime.now().date():
    data = daily_data[current_date]
    day_string = current_date.strftime('%Y-%m-%d')
    avg_open_to_merge = sum(data['Open to Merge']) / len(data['Open to Merge']) if data['Open to Merge'] else 0
    avg_open_to_review = sum(data['Open to Review Start']) / len(data['Open to Review Start']) if data['Open to Review Start'] else 0
    avg_review_to_merge = sum(data['Review Start to Merge']) / len(data['Review Start to Merge']) if data['Review Start to Merge'] else 0

    creators_str = "\n".join([f"{name}: {count} PRs" for name, count in data['Creators'].items()])
    approvers_str = "\n".join([f"{name}: {count} approvals" for name, count in data['Approvers'].items()])

    all_daily_data.append({
        'Date': day_string,
        'Open to Merge': avg_open_to_merge,
        'Open to Review Start': avg_open_to_review,
        'Review Start to Merge': avg_review_to_merge,
        'Number of PRs': data['Number of PRs'],
        'PR Creators': creators_str,
        'PR Approvers': approvers_str
    })
    current_date += timedelta(days=1)

all_weekly_data = []
for week_end, data in sorted(weekly_data.items()):
    week_start_str = (week_end - timedelta(days=6)).strftime('%Y-%m-%d')
    week_end_str = week_end.strftime('%Y-%m-%d')
    week_string = f"{week_start_str} to {week_end_str}"
    avg_open_to_merge = sum(data['Open to Merge']) / len(data['Open to Merge']) if data['Open to Merge'] else 0
    avg_open_to_review = sum(data['Open to Review Start']) / len(data['Open to Review Start']) if data['Open to Review Start'] else 0
    avg_review_to_merge = sum(data['Review Start to Merge']) / len(data['Review Start to Merge']) if data['Review Start to Merge'] else 0

    creators_str = "\n".join([f"{name}: {count} PRs" for name, count in data['Creators'].items()])
    approvers_str = "\n".join([f"{name}: {count} approvals" for name, count in data['Approvers'].items()])

    all_weekly_data.append({
        'Week': week_string,
        'Open to Merge': avg_open_to_merge,
        'Open to Review Start': avg_open_to_review,
        'Review Start to Merge': avg_review_to_merge,
        'Number of PRs': data['Number of PRs'],
        'PR Creators': creators_str,
        'PR Approvers': approvers_str
    })

# Writing to HTML
df_daily = pd.DataFrame(all_daily_data)
df_weekly = pd.DataFrame(all_weekly_data)
with open('results.html', 'w') as f:
    f.write("<h2>Daily Data</h2>")
    f.write(df_daily.to_html(index=False))
    f.write("<h2>Weekly Data</h2>")
    f.write(df_weekly.to_html(index=False))
