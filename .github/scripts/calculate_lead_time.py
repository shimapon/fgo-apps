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
    'creation_to_merge': [],
    'creation_to_review': [],
    'review_to_close': [],
    'num_prs': 0
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
        daily_data[closed_at.date()]['creation_to_review'].append(count_hours(created_at, first_review_time))
        daily_data[closed_at.date()]['review_to_close'].append(count_hours(first_review_time, closed_at))
    daily_data[closed_at.date()]['creation_to_merge'].append(count_hours(created_at, closed_at))
    daily_data[closed_at.date()]['num_prs'] += 1

all_data = []
for the_date, data in sorted(daily_data.items()):
    day_string = the_date.strftime('%Y-%m-%d')
    avg_creation_to_merge = sum(data['creation_to_merge']) / len(data['creation_to_merge']) if data['creation_to_merge'] else 0
    avg_creation_to_review = sum(data['creation_to_review']) / len(data['creation_to_review']) if data['creation_to_review'] else 0
    avg_review_to_close = sum(data['review_to_close']) / len(data['review_to_close']) if data['review_to_close'] else 0
    
    all_data.append({
        'Date': day_string,
        'Average Time Open to Merge (hours)': avg_creation_to_merge,
        'Average Time Creation to Review (hours)': avg_creation_to_review,
        'Average Time Review to Close (hours)': avg_review_to_close,
        'Number of PRs Created': data['num_prs']
    })

df = pd.DataFrame(all_data)
with open('daily_results.html', 'w') as f:
    f.write(df.to_html(index=False))
