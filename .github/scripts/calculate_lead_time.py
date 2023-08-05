import os
import requests
from collections import defaultdict
from datetime import datetime, timedelta
import pandas as pd

def count_hours(start, end):
    return (end - start).total_seconds() / 3600  # Convert total seconds to hours

token = os.getenv('MY_GITHUB_TOKEN')
headers = {'Authorization': f'token {token}'}
repo = "shimapon/fgo-apps"

hourly_data = defaultdict(lambda: {
    'lead_times': [],
    'creator_counts': defaultdict(int),
    'approver_counts': defaultdict(int),
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
    lead_time = count_hours(created_at, closed_at)
    creator = pull['user']['login']
    pull_number = pull['number']
    response = requests.get(f"https://api.github.com/repos/{repo}/pulls/{pull_number}/reviews", headers=headers)
    reviews = response.json()

    approver = None
    for review in reviews:
        if review['state'] == 'APPROVED':
            approver = review['user']['login']
    
    # 時間毎の計算
    hour_number = int((datetime.now() - closed_at).total_seconds() // 3600)
    hourly_data[hour_number]['lead_times'].append(lead_time)
    hourly_data[hour_number]['creator_counts'][creator] += 1
    if approver:
        hourly_data[hour_number]['approver_counts'][approver] += 1
        
all_data = []
for hour_number, data in sorted(hourly_data.items()):
    the_hour = datetime.now() - timedelta(hours=hour_number)
    hour_string = the_hour.strftime('%Y-%m-%d %H:00')
    avg_lead_time = sum(data['lead_times']) / len(data['lead_times'])
    num_prs = len(data['lead_times'])
    creators = "\n".join([f"{creator}: {count} PRs" for creator, count in data['creator_counts'].items()])
    approvers = "\n".join([f"{approver}: {count} approvals" for approver, count in data['approver_counts'].items()])
    all_data.append({
        'Hour': hour_string,
        'Average Lead Time (hours)': avg_lead_time,
        'Number of PRs': num_prs,
        'PR Creators': creators,
        'PR Approvers': approvers
    })

df = pd.DataFrame(all_data)
with open('results.html', 'w') as f:
    f.write(df.to_html(index=False))
