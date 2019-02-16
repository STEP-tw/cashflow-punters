set -e

cp .github/git_pre_commit_hook .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
echo "#Setup-- creating git's precomit hook"
npm install
echo "#Setup-- installing node dependencies"
git config --local commit.template "./.github/git_commit_template"
echo "#Setup-- setting commit template in git config"
