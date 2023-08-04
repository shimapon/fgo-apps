import os
import requests
from collections import defaultdict
from datetime import datetime, timedelta

def count_weekdays(start, end):
    total = 0
    current = start
    while current < end:
        if current.weekday() < 5:  # 0-4 denotes Monday to Friday
            total += 1
        current += timedelta(days=1)
    return total

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
    lead_time = count_weekdays(created_at, closed_at) * 24  # 平日のみを考慮して時間単位に変換

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
with open('results.txt', 'w') as f:
    for week_number, data in sorted(weekly_data.items()):
        start_date = datetime.now() - timedelta(days=(week_number+1)*7)
        end_date = datetime.now() - timedelta(days=week_number*7)
        f.write(f"Week from {start_date.strftime('%Y-%m-%d')} to {end_date.strftime('%Y-%m-%d')}:\n")
        f.write(f"Average lead time: {sum(data['lead_times']) / len(data['lead_times'])} hours\n")
        f.write(f"Number of PRs: {len(data['lead_times'])}\n")

        f.write("\nPR creators:\n")
        for creator, count in data['creator_counts'].items():
            f.write(f"{creator}: {count} PRs\n")

        f.write("\nPR approvers:\n")
        for approver, count in data['approver_counts'].items():
            f.write(f"{approver}: {count} approvals\n")
        f.write("\n")
