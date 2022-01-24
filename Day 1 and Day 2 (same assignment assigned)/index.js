const express = require('express');
const { all } = require('express/lib/application');
const app = express();
const port = 8080;
const fs = require('fs');
const myMusics = require('./MusicDatabase.json');

//middleware
app.use(express.json());

app.get('/', ( req, res) => {
    res.status(200).json({
        address1 : `Access : 'http://localhost:${port}/music' to see your all music`,
        address2 : `Access : 'http://localhost:${port}/addmusic' to add new music`,
        address3 : `Access : 'http://localhost:${port}/updatemusic/{music name you want to change}'`,
        address4 : `Access : 'http://localhost:${port}/delete/{music name you want to delete}'`,
        address5 : `Access : 'http://localhost:${port}/favourite' to see your favourite music`,
        address6 : `Access : 'http://localhost:${port}/assignfavourite/{music name you want to make it favourite}'`,
    })
})
app.get('/music', ( req, res) => {
    const allMusic = myMusics.map( music => {
        delete music.favourite;
        return music;
    })
    if(allMusic.length>0){
        res.status(200).json({
            Message : 'Here is Your all Music !',
            Data :  allMusic
        })
    }else{
        res.status(204).json({
            Message : 'Here is Your all Music !',
            Data :  'No Music is there in your playlist'
        })
    }
})

app.post('/addmusic', ( req, res ) => {
    const { name, favourite } = req.body;
    const newMusic = { name, favourite};
    const musicExist = myMusics.find(music => {
        return music.name === name;
    })
    if(musicExist){
        res.status(406).json({
            Message : 'New Music Not Added , it\'s Already Exist !',
            Data : newMusic
        })
    }else{
        myMusics.push(newMusic);
        fs.writeFile('./MusicDatabase.json', JSON.stringify(myMusics), (err) => {
            if(err){
                res.status(500).send('server Error ! ', err);
            }else{
                res.status(201).json({
                    Message : 'New Music added !',
                    Data : newMusic
                })
            }
        })
    }
})

app.put('/updatemusic/:name', ( req, res) => {
    const { name } = req.params;
    const { newName, favourite} = req.body;
    const musicfound = myMusics.find(music => {
        return (music.name === name);
    })
    const newmusicExist = myMusics.find(music => {
        return music.name === newName;
    })
    if(musicfound){
        if((musicfound.name !== newName) || (musicfound.favourite !== favourite)){
            if(newmusicExist){
                res.status(406).json({
                    Message : 'This Music with same name already Exist . Hence, Not Updated !',
                    Data : `music name : ${newName}`
                })
            }else{
                musicfound.name = newName;
                musicfound.favourite = favourite;
                fs.writeFile('./MusicDatabase.json',JSON.stringify(myMusics), err => {
                    if(err){
                        res.status(501).send('Internal error !')
                    }else{
                        res.status(202).json({
                            Message : 'Music Updated !',
                            Data : musicfound
                        })
                    }
                })
            }
        }else{
            res.status(406).json({
                Message : 'Not Updated !',
                Data : 'Original Data Not Changed'
            })
        }  
    }else{
        res.status(204).json({
            Message : 'This Music is Not in your list . Hence, Not Updated !',
            Data : `music name : ${name}`
        })
    }
})
app.put('/assignfavourite/:name', ( req, res) => {
    const { name } = req.params;
    const { favourite } = req.body;
    const musicfound = myMusics.find(music => {
        return (music.name === name);
    })
    if(musicfound){
        if(musicfound.favourite !== favourite){
            musicfound.favourite = favourite;
            fs.writeFile('./MusicDatabase.json',JSON.stringify(myMusics), err => {
                if(err){
                    res.status(500).send('Internal error !')
                }else{
                    res.status(201).json({
                        Message : 'Music Updated !',
                        Data : musicfound
                    })
                }
            })
        } else{
            res.status(406).json({
                Message : 'Not assign Favourite  !',
                Data : 'Original Data Not Changed'
            })
        } 
    }else{
        res.status(204).json({
            Message : 'This Music is Not in your list . Hence, Not assign Favourite !',
            Data : `music name : ${name}`
        })
    }
})

app.delete('/delete/:name', (req, res) => {
    const { name } = req.params;
    const musicExist = myMusics.find(music => {
        return music.name === name;
    })
    if(musicExist){
        const index = myMusics.indexOf(musicExist);
        myMusics.splice(index, 1);
        fs.writeFile('/MusicDatabase.json',JSON.stringify(myMusics), err => {
            if(err){
                res.status(500).json({
                    Message : 'This Music doesnt Deleted . Internal Error !', err,
                    Data : `music name : ${name}`
                })
            }else{
                res.status(200).json({
                    Message : 'This Music is Deleted !',
                    Data : `music name : ${name}`
                })
            }
        })
    }else{
        res.status(406).json({
            Message : 'This Music is Not in your list . Hence, Not Deleted !',
            Data : `music name : ${name}`
        })
    }

})

app.get('/favourite', (req, res) => {
    const favMusic = myMusics.filter( music => {
        return music.favourite === true;
    })
    if(favMusic){
        res.status(200).json({
            Message : 'Here is your Favourite PlayList !',
            Data : favMusic
        })
    }else{
        res.status(200).json({
            Message : 'Here is your Favourite PlayList !',
            Data : 'You don\'t have any music in Favourite PlayList '
        })
    }
    
})






app.listen( port , ( req, res ) => {
    console.log(`Server is running on Port number : ${port} !...`);
})