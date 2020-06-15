const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");
const { response } = require("express");

const app = express();

app.use(express.json());
app.use(cors());

function existOrNot(request,responde,next){
  const { id } = request.params

  if(!isUuid(id)){
    return response.status(400).send({error:"Id not exist"})
  }

  return next()
}


const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories)
});

app.post("/repositories", (request, response) => {

  const { title ,url ,techs}= request.body

  const repo ={
    id:uuid(),
    title,
    url,
    techs,
    likes:0
  }
  repositories.push(repo)
  return response.json(repo)
});

app.put("/repositories/:id",existOrNot, (request, response) => {
 
  const { id }= request.params

  const { title ,url ,techs}= request.body

  const repoIndex = repositories.findIndex(repositorie => repositorie.id === id)

  if(repoIndex < 0){
    return response.status(404).response.json({message:"error repositorie dont exist!"})
  }
  
  const repo ={
    id,
    title,
    url,
    techs,
    likes:0
  }

  repositories[repoIndex] = repo

  return response.json(repo)
});

app.delete("/repositories/:id",existOrNot, (request, response) => {
 
  const { id }= request.params

  const repoIndex = repositories.findIndex(repositorie => repositorie.id === id)

  if(repoIndex < 0){
    return response.status(404).response.json({message:"error repositorie dont exist!"})
  }

  repositories.splice(repoIndex,1)

  return response.status(204).json()
});

app.post("/repositories/:id/like", existOrNot,(request, response) => {

  const { id }= request.params


  const repoIndex = repositories.findIndex(repositorie => repositorie.id === id)

  if(repoIndex < 0){
    return response.status(404).response.json({message:"error repositorie dont exist!"})
  }

  const oldRepo = repositories[repoIndex]

  const repo = {
    ...oldRepo,
    likes:oldRepo.likes + 1
  }

  repositories[repoIndex] = repo

  return response.json(repo)


});

module.exports = app;
