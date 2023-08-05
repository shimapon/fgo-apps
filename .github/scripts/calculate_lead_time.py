import os
import requests
from collections import defaultdict
from datetime import datetime, timedelta
import pandas as pd

def count_hours(start, end):
    total_hours = (end - start).seconds / 3600 + (end - start).days * 24
    return total_hours

token = os.getenv('MY_GITHUB_TOKEN')
headers = {'Authorization': f'token {token}'}
repo = "shimapon/fgo-apps"

daily_data = defaultdict(lambda: {
    'Open to Merge': [],
    'Open to Review Start': [],
    'Review Start to Merge': [],
    'Number of PRs': 0
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
    if closed_at < datetime.now() - timedelta(days=90):
        continue
    created_at = datetime.strptime(pull['created_at'], '%Y-%m-%dT%H:%M:%SZ')
    
    pull_number = pull['number']
    response = requests.get(f"https://api.github.com/repos/{repo}/pulls/{pull_number}/reviews", headers=headers)
    reviews = response.json()

    first_review_time = None
    for review in reviews:
        if review['state'] in ['APPROVED', 'CHANGES_REQUESTED']:
            first_review_time = datetime.strptime(review['submitted_at'], '%Y-%m-%dT%H:%M:%SZ')
            break
    
    if first_review_time:
        daily_data[closed_at.date()]['Open to Review Start'].append(count_hours(created_at, first_review_time))
        daily_data[closed_at.date()]['Review Start to Merge'].append(count_hours(first_review_time, closed_at))
    daily_data[closed_at.date()]['Open to Merge'].append(count_hours(created_at, closed_at))
    daily_data[closed_at.date()]['Number of PRs'] += 1

all_data = []
for the_date, data in sorted(daily_data.items()):
    day_string = the_date.strftime('%Y-%m-%d')
    avg_open_to_merge = sum(data['Open to Merge']) / len(data['Open to Merge']) if data['Open to Merge'] else 0
    avg_open_to_review = sum(data['Open to Review Start']) / len(data['Open to Review Start']) if data['Open to Review Start'] else 0
    avg_review_to_merge = sum(data['Review Start to Merge']) / len(data['Review Start to Merge']) if data['Review Start to Merge'] else 0
    
    all_data.append({
        'Date': day_string,
        'Open to Merge': avg_open_to_merge,
        'Open to Review Start': avg_open_to_review,
        'Review Start to Merge': avg_review_to_merge,
        'Number of PRs': data['Number of PRs']
    })

df = pd.DataFrame(all_data)
with open('daily_results.html', 'w') as f:
    f.write(df.to_html(index=False))
