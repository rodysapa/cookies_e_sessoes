var express = require('express');
var Task = require("../model/Tasks")
var TaskSchema = require("../validators/TaskValidator")
const Joi = require("joi")

var router = express.Router();

// Middleware for checking authentication
function isAuthenticated(req, res, next) {
    if (req.session.user) {
        return next();
    }
    res.status(401).send('Unauthorized: Please log in to manage tasks.');
}

// Retrieve session-based tasks
function getUserTasks(req) {
    return req.session.tasks || (req.session.tasks = []);
}


/* GET home page. */
router.get('/', function(req, res, next) {
  if (getUserTasks(req).length == 0) {
  }

  let obj = Task.getElementById(req.query.tid);
  res.render('new', { tasks: getUserTasks(req), task: obj });
});


router.post("/tarefas", isAuthenticated, function (req, res){
    const tasks = getUserTasks(req);

    const {error, value} = TaskSchema.validate(req.body);
    if (error) {
      res.render('index', { tasks: getUserTasks(req), erro: "Dados incompletos" });
      return;
    }
    
    const {id, nome} = value
    if (id === undefined) {
      //Inserir
      Task.new(nome);
    } else {
      //Alterar
      Task.update(id, nome);
    }
    
    res.redirect("/");
})

router.get("/tarefas/del/:id", function(req, res){
  const {id} = req.params;
  const {error, value} = Joi.number().integer().greater(0).validate(id)

  if (error || !Task.delete(value)) {
    res.send("Falha ao excluir uma tarefa");
    return;
  }
  res.redirect("/");
})

router.get("/tarefas/count", function (req,res){
  const taskCount = getUserTasks(req).length;
  res.render('count', {totalTasks: taskCount});
})

module.exports = router;
