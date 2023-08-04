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


# GitHubのtokenとリポジトリ情報を設定
token = os.getenv('MY_GITHUB_TOKEN')
headers = {'Authorization': f'token {token}'}
repo = "shimapon/fgo-apps"

# 週ごとのデータを集計する辞書
weekly_data = defaultdict(lambda: {
    'lead_times': [],
    'creator_counts': defaultdict(int),
    'approver_counts': defaultdict(int),
})

# APIからデータを取得
page = 1
pulls = []
while True:
    response = requests.get(
        f"https://api.github.com/repos/{repo}/pulls?state=closed&page={page}&per_page=100", 
        headers=headers
    )
    data = response.json()
    if not data:
        break
    pulls.extend(data)
    page += 1

for pull in pulls:
    # 'base'ブランチが'develop'でなければスキップ
    if pull['base']['ref'] != 'develop':
        continue

    closed_at = datetime.strptime(pull['closed_at'], '%Y-%m-%dT%H:%M:%SZ')

    # 過去3ヶ月以内のPRだけを考慮
    if closed_at < datetime.now() - timedelta(days=90):
        continue

    # PRのリード時間を計算
    created_at = datetime.strptime(pull['created_at'], '%Y-%m-%dT%H:%M:%SZ')
    lead_time = count_weekday_hours(created_at, closed_at)

    # PRの作成者を集計
    creator = pull['user']['login']

    # PRのレビューを取得
    pull_number = pull['number']
    response = requests.get(f"https://api.github.com/repos/{repo}/pulls/{pull_number}/reviews", headers=headers)
    reviews = response.json()

    # approverをリセット
    approver = None
    for review in reviews:
        # レビューが承認されていれば、アプルーバーを更新
        if review['state'] == 'APPROVED':
            approver = review['user']['login']
    # どの週に該当するデータなのかを計算
    week_number = (datetime.now() - closed_at).days // 7

    # 週ごとのデータを集計
    weekly_data[week_number]['lead_times'].append(lead_time)
    weekly_data[week_number]['creator_counts'][creator] += 1
    if approver:  # アプルーバーがいる場合だけカウント
        weekly_data[week_number]['approver_counts'][approver] += 1

# レポートを作成
with open('results.html', 'w') as f:
    for week_number, data in sorted(weekly_data.items()):
        start_date = datetime.now() - timedelta(days=(week_number+1)*7)
        end_date = datetime.now() - timedelta(days=week_number*7)
        week_range = f"Week from {start_date.strftime('%Y-%m-%d')} to {end_date.strftime('%Y-%m-%d')}"
        
        avg_lead_time = sum(data['lead_times']) / len(data['lead_times'])
        num_prs = len(data['lead_times'])
        creators = "\n".join([f"{creator}: {count} PRs" for creator, count in data['creator_counts'].items()])
        approvers = "\n".join([f"{approver}: {count} approvals" for approver, count in data['approver_counts'].items()])
        
        # DataFrameを作成
        df = pd.DataFrame({
            'Week Range': [week_range],
            'Average Lead Time (hours)': [avg_lead_time],
            'Number of PRs': [num_prs],
            'PR Creators': [creators],
            'PR Approvers': [approvers]
        })
        
        # DataFrameをHTMLに変換して書き込み
        f.write(df.to_html(index=False))
