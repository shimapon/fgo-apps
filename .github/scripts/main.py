import os
from datetime import datetime
from collections import defaultdict
import github_api
import data_processing
import output

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