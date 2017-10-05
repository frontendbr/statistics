module.exports = function (issuesParams) {

  return `
    query ParticipantsOfIssues {
      repository(owner: "frontendbr", name: "forum") {
        id
        name
        issues(${issuesParams}) {
          edges{
            cursor
          }
          nodes{
            id
            number
            title
            participants(first:100) {
              totalCount
              edges{
                node{
                  login
                }
              }
            }
            author {
              login
            }
          }
        }
      }
    }`;
}
