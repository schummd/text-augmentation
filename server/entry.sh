#!/bin/bash --login
conda init bash
source /root/.bashrc
set -euo pipefail
conda activate base_conda_env
python src/api.py
# FLASK_APP=src/api.py flask run
exec "$@"