const express = require('express');
const cors = require('cors');
const app = express();
const actions = require('./data/helpers/actionModel');
const mappers = require('./data/helpers/mappers');
const projects = require('./data/helpers/projectModel');

const port = 5000;

app.use(express.json());
app.use(cors());

//*****Error Handler*****/
const errorHandler = (status, message, res) => {
    res.status(status).json({ error: message });
};

//*****Project Endpoints*****/
app.get('/api/projects', (req, res) => {
    project.get()
        .then( proj => {
            res.status(200).json(projectsList)
        })
        .catch(error => {
            return errorHandler(500, "Project done got borked.", res);
        });
});

app.get('/api/projects/:id', (req,res) => {
    const { id } = req.params
    projects.get(id)
        .then (proj => {
            res.status(200).json(proj)
        })
        .catch(error => {
            return errorHandler(404, 'Derp! Ya done gone lost that thang!', res);
        });
});

app.post('/api/projects/:id', (req, res) => {
    const { name, description, completed } = req.body
    if (!name || !description) {
        return errorHandler(400, 'Oh no! You need a name and a description!', res);
    } else {
        projects.insert({ name, description, completed })
            .then( proj => {
                res.status(201).json(proj)
            })
            .catch(error => {
                return errorHandler(500, 'Merp de derp. Yousa founda ze problem.', res);
            })
    }
})

app.delete('/api/projects/:id', (req, res) => {
    const { id } = req.params
    projects.remove(id)
        .then(resp => {
            if (resp) {
                res.status(200)
                projects.get()
                    .then( projectsList => {
                        res.status(200).json(projectsList)
                    })
                    .catch(error => {
                        return errorHandler(500, 'Cannot get list of projects', res);
                    })
            } else {
                return errorHandler(404, `Cannot find a project with id of ${id}`, res);
            }
        })
        .catch(error => {
            return errorHandler(500, 'No such luck, please let someone know that you have a problem', res);
        })
})

app.put('/api/projects/:id', (req, res) => {
    const { id } = req.params
    const { name, description, completed } = req.body
    if (!name || !description) {
        return errorHandler(400, 'Hoooo buddy, sumthin here got broke!!', res);
    } else {
        projects.update(id, { name, description, completed })
            .then (proj => {
                proj ? res.status(201).json(proj) : res.status(500).json({ error: 'Unable to update this project.' })
            })
            .catch(error => {
                return errorHandler(500, 'This way of handling errors is easier than the turnary operator', res);
            })
    }
})

app.get('/api/projects/:ie/actions', (req, res) => {
    const { id } = req.params
    projects.getprojectActions(id)
        .then(projectActions => {
            res.status(200).json(projectActions)
        })
        .catch(error => {
            return errorHandler(500, 'Cannot find actionss by this id', res)
        })
})


//*****Project Endpoints*****/
app.get('api/actions', (req, res) => {
    actions.get()
        .then( actionList => {
            res.status(200).json(actionsList)
        })
        .catch(error => {
            return errorHandler(500, 'Cannot get le actions.', res)
        })
})

app.get('/api/actions/:id', (req, res) => {
    const { id } = req.params
    actions.get(id)
        .then( action => {
            res.status(200).json(action)
        })
        .catch(error => {
            return errorHandler(404, 'Cannot find the action with this id.', res)
        })
})

app.post('/api/projects/:id/action', (req, res) => {
    const { id } = req.params
    const { description, notes, completed } = req.body
    if(!description) {
        return errorHandler(400, 'You must provide a description.', res)
    } else {
        let value = null;
        if (notes !== undefined) {
            value = actions.insert({
                project_id: id,
                description: description,
                notes: notes,
                completed: completed
            })
        } else {
            value = actions.insert({
                project_id: id,
                description: description,
                notes: '',
                completed: completed
            })
        }
        value
            .then(action => {
                res.status(201).json(action)
            })
            .catch(error => {
                return errorHandler(500, 'Cannot create this action for this project.', res);
            })
    }
})

app.delete('/api/actions/:id', (req, res) => {
    const { id } = req.params
    actions.remove(id)
        .then(response => {
            if(response) {
                res.status(200)
                actions.get()
                    .then( actionsList => {
                        res.status(200).json(actionsList)
                    })
                    .catch(error => {
                        return errorHandler(500, 'There has been an internal server issue.', res);
                    })
            } else {
                return errorHandler(404, 'Cannot delete this action at this time')
            }
        })
        .catch(error => {
            return errorHandler(500, 'Server malfunction.', res);
        })
})

app.put('/api/actions/:id', (req, res)  => {
    const { id } = req.params
    const { description, notes, completed } = req.body
    
    if(!description) {
        return errorHandler(400, 'Provide a description.', res);
    } else {
        let value = null;
        if(notes) {
            value = actions.update(id, {
                description: description,
                notes: notes,
                completed: completed
            })
        } else {
            value = actions.update(id, {
                description: description,
                notes: '',
                completed: completed
            })
        }
    }
    result
        .then(action => {
            res.status(201).json(action)
    })
        .catch(error => {
            return errorHandler(500, 'Internal server error.', res)
        })
})


app.listen(port, () => console.log(`Server listening on port ${port}`));