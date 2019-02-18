set -e

echo "#Setup-- Creating git's precomit hook"
cp .github/git_pre_commit_hook .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
echo "#Setup-- Installing node dependencies"
npm install
echo "#Setup-- Setting commit template in git config"
git config --local commit.template "./.github/git_commit_template"
