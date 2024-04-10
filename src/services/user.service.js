import { Email } from '@mui/icons-material'
import { storageService } from './async-storage.service'
import { httpService } from './http.service'
import { utilService } from './util.service'
import { info } from 'sass'

const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'

export const userService = {
    login,
    logout,
    signup,
    getLoggedinUser,
    saveLocalUser,
    getUsers,
    getById,
    remove,
    update,
    // changeScore
}

window.userService = userService


function getUsers() {
    return storageService.query('user')
    // return httpService.get(`user`)
}

async function getById(userId) {
    const user = await storageService.get('user', userId)
    // const user = await httpService.get(`user/${userId}`)
    return user
}

function remove(userId) {
    return storageService.remove('user', userId)
    // return httpService.delete(`user/${userId}`)
}

async function update({ _id }) {
    const user = await storageService.get('user', _id)
    await storageService.put('user', user)

    // const user = await httpService.put(`user/${_id}`, {_id, score})

    // When admin updates other user's details, do not update loggedinUser
    if (getLoggedinUser()._id === user._id) saveLocalUser(user)
    return user
}

async function login(userCred) {
    const users = await storageService.query('user')
    const user = users.find(user => user.username === userCred.username)
    // const user = await httpService.post('auth/login', userCred)
    if (user) return saveLocalUser(user)
}

async function signup(userCred) {
    if (!userCred.imgUrl) userCred.imgUrl = "../../public/img/default-user-img.png"
    const user = await storageService.post('user', userCred)
    // const user = await httpService.post('auth/signup', userCred)
    return saveLocalUser(user)
}

async function logout() {
    sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
    // return await httpService.post('auth/logout')
}

// async function changeScore(by) {
//     const user = getLoggedinUser()
//     if (!user) throw new Error('Not loggedin')
//     user.score = user.score + by || by
//     await update(user)
//     return user.score
// }

function saveLocalUser(user) {
    user = {
        _id: user._id,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        username: user.username,
        isAdmin: user.isAdmin,
        info: user.info
    }

    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user))
    return user
}

function getLoggedinUser() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER))
}


;(async ()=>{
    await userService.signup(_createUser('Adi', 'Sidis', '123', false, 'adisidis', 'adisidis@gmail.com'))
    await userService.signup(_createUser('Admin', 'Admin', '123', true, 'adminadmin', 'adminadmin@gmail.com'))
    await userService.signup(_createUser('Sagi', 'Aivas', '123', false, 'sagiaivas', 'sagiaivas@gmail.com'))
})()




//DEMO DATA USER

function _createUser(firstname, lastname, password, isAdmin = false, username, email) {
    return {
        _id: utilService.makeId(),
        email,
        firstname,
        lastname,
        username,
        password,
        isAdmin,
        info: {
            posts: '13',
            followers : '1233',
            following : '6754'
        }
    }
}

