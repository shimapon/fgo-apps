import os
import requests
from collections import defaultdict
from datetime import datetime, timedelta
import pandas as pd

def count_weekday_hours(start, end):
    total_hours = 0
    current = start
    while current < end:
        if current.weekday() < 5:  # 0-4 denotes Monday to Friday
            if current.date() == end.date():
                total_hours += (end - current).seconds / 3600
            else:
                total_hours += 24
        current += timedelta(days=1)
    return total_hours

token = os.getenv('MY_GITHUB_TOKEN')
headers = {'Authorization': f'token {token}'}
repo = "shimapon/fgo-apps"

daily_data = defaultdict(lambda: {
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
    lead_time = count_weekday_hours(created_at, closed_at)
    creator = pull['user']['login']
    pull_number = pull['number']
    response = requests.get(f"https://api.github.com/repos/{repo}/pulls/{pull_number}/reviews", headers=headers)
    reviews = response.json()

    approver = None
    for review in reviews:
        if review['state'] == 'APPROVED':
            approver = review['user']['login']
    
    # 日ごとの計算
    day_number = (datetime.now() - closed_at).days
    daily_data[day_number]['lead_times'].append(lead_time)
    daily_data[day_number]['creator_counts'][creator] += 1
    if approver:
        daily_data[day_number]['approver_counts'][approver] += 1
        
all_data = []
for day_number, data in sorted(daily_data.items()):
    the_date = datetime.now() - timedelta(days=day_number)
    day_string = the_date.strftime('%Y-%m-%d')
    avg_lead_time = sum(data['lead_times']) / len(data['lead_times'])
    num_prs = len(data['lead_times'])
    creators = "\n".join([f"{creator}: {count} PRs" for creator, count in data['creator_counts'].items()])
    approvers = "\n".join([f"{approver}: {count} approvals" for approver, count in data['approver_counts'].items()])
    all_data.append({
        'Date': day_string,
        'Average Lead Time (hours)': avg_lead_time,
        'Number of PRs': num_prs,
        'PR Creators': creators,
        'PR Approvers': approvers
    })

df = pd.DataFrame(all_data)
with open('results.html', 'w') as f:
    f.write(df.to_html(index=False))
