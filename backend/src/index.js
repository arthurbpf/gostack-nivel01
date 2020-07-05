const { uuid, isUuid } = require('uuidv4');
const cors = require('cors');
const express = require('express');

const app = express();

app.use(cors());
//necessario para utilizar json no express
app.use(express.json());
const projects = [];

//middleware
function logRequests(request, response, next) {
  const { method, url } = request;

  const logLabel = `[${method.toUpperCase()}] ${url}`;

  console.time(logLabel);

  next();

  console.timeEnd(logLabel);

  return;
}

function validateProjectId(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ error: 'invalid project id' });
  }

  return next();
}

app.use(logRequests);
app.use('/projects/:id', validateProjectId);

app.get('/projects', (request, response) => {
  const { title } = request.query;

  const results = title ? projects.filter((project) => project.title.includes(title)) : projects;

  return response.json(results);
});

app.post('/projects', (request, response) => {
  const { title, owner } = request.body;

  const project = { id: uuid(), title, owner };

  projects.push(project);

  return response.json(project);
});

app.put('/projects/:id', (request, response) => {
  const { id } = request.params;
  const { title, owner } = request.body;

  const projectIndex = projects.findIndex((project) => project.id === id);

  if (projectIndex < 0) {
    return response.status(400).json({ error: 'project not found' });
  }

  const project = {
    id,
    title,
    owner,
  };

  projects[projectIndex] = project;

  return response.json(project);
});

app.delete('/projects/:id', (request, response) => {
  const { id } = request.params;

  const projectIndex = projects.findIndex((project) => project.id === id);

  if (projectIndex < 0) {
    return response.status(400).json({ error: 'project not found' });
  }

  projects.splice(projectIndex, 1);

  return response.status(204).json();
});

app.listen(3333, () => {
  console.log('🚀 Back-end started!');
});
