export const apiPaths = {
    getProjects: 'project/getProjects',
    getProject: '/projects/:id',
    createProject: 'project/createProject',
    updateProject: 'project',
    createTask: 'task/createTask',
    getTasks: 'task/getTasks',
    updateTask: 'task/updateTask',
    deleteTask: 'task/deleteTask',
    getIssues: 'issue/getIssues',
    createIssue: 'issue/createIssue',
    getDiscussions: 'discussion/getDiscussions',
    createDiscussion: 'discussion/createDiscussion',
    updateDiscussion: 'discussion/updateDiscussion',
    deleteDiscussion: 'discussion/deleteDiscussion',
    getComments: 'comment/getComments',
    addComment: 'comment/addComment',
    authenticate: 'user/authenticate',
    getUsers: 'user/getUsers',
    getActiveUsers: 'user/getActiveUsers',
    getNotifications: 'notification/getNotifications',
    sendMessage: 'chat/sendMessage',
    getMessages: 'chat/getMessages',
    createProjectModule: 'projectModule/create',
    getProjectModules: 'projectModule/project', // Append /:projectId when using
    createApi: 'api/create',
    getApis: 'api/project', // Append /:projectId when using
    updateApi: 'api', // Append /:id when using
    deleteApi: 'api', // Append /:id when using
    getNote: 'note/getNote',
    saveNote: 'note/saveNote'
}