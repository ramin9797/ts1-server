const Docker = require('dockerode');
const fs = require('fs');

const dockerConfig = {
  host: '13.53.168.134',
  port: 2375, // or the appropriate Docker API port
  key: fs.readFileSync('/home/ramin/Downloads/ssh1.pem'),
  version: 'v1.41', // Specify the Docker API version you want to use
};

const docker = new Docker(dockerConfig);

// Now you can use the 'docker' object to interact with the Docker API
// For example:
function listContainers(){
    return new Promise(function(resolve,reject){
        docker.listContainers({all:true},(err, containers) => {
            if (err) {
            console.error('Error retrieving container list:', err);
            reject(err)
            return;
            }
            console.log('Running containers:', containers);
            resolve(containers)
        });
    })

}

const stopContainer = async (containerId) => {
    return new Promise(function(resolve,reject){
      const container = docker.getContainer(containerId);
       container.stop(function(err,res){
            if(err){
                console.log('reee',err)
                reject(err)
            }    else{
                console.log('res',res);
                resolve(res)
            }
       });
    })
  };


  const startContainer = async (containerId) => {
    return new Promise(function(resolve,reject){
      const container = docker.getContainer(containerId);
       container.start(function(err,res){
            if(err){
                console.log('reee',err)
                reject(err)
            }    else{
                console.log('res',res);
                resolve(res)
            }
       });
    })
  };


module.exports = {listContainers,stopContainer,startContainer};


// var container = docker.getContainer('9ba095dabc1e');

// // query API for container info
// container.inspect(function (err, data) {
//   console.log(data);
// });
