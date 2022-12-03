let url = "http://localhost:7777"
let form = document.forms.add
let search = document.querySelector('#search')
let workers = document.querySelector('.workers')
let all_staff = document.querySelector('.all_staff')
let all_upgrate = document.querySelector('.all_upgrate')
let header_bonus = document.querySelector('.header_bonus')
let header_count = document.querySelector('.header_count')
let mare = document.querySelector('.mare')

let arr = []

function fetchUser() {
    axios.get(url + '/users')
        .then(res => {
            reload(res.data)
            arr = res.data

            let more = arr.filter(item => item.salary >= 1000)
            let incrise = arr.filter(item => item.increase === true)
            let rise = arr.filter(item => item.rise === true)

            header_bonus.innerHTML = `Премию получает: ${rise.length}`

            all_staff.onclick = () => {
                reload(res.data)
            }

            mare.onclick = () => {
                reload(more)
            }

            all_upgrate.onclick = () => {
                reload(incrise)
            }

        })
}
fetchUser()

form.onsubmit = (e) => {
    e.preventDefault()

    let user = {
        id: Math.random(),
        increase: false,
        rise: false,
    }

    let fm = new FormData(form)

    fm.forEach((value, key) => {
        user[key] = value
    })

    axios.post(url + '/users', user)
        .then(res => console.log(res))

    fetchUser()

}

search.onkeyup = () => {
    let filtered = arr.filter(item => item.name.toLowerCase().includes(search.value.toLowerCase()))
    reload(filtered)
}

const reload = (arr) => {
    
    workers.innerHTML = ''

    let count = 0
    count = arr.length

    header_count.innerHTML = `Общее число сотрудников: ${count}`

    for (let item of arr) {

        let inp_val_inp = document.createElement('input')
        let worker_block = document.createElement('div')
        let worker_block_left = document.createElement('div')
        let worker_block_right = document.createElement('div')
        let salary = document.createElement('div')
        let best = document.createElement('img')
        let del = document.createElement('img')
        let star = document.createElement('img')

        inp_val_inp.classList.add('inp_val_inp')
        inp_val_inp.value = item.salary + '$'
        worker_block.classList.add('worker_block')
        worker_block_left.classList.add('worker_block_left')
        worker_block_left.innerHTML = item.name
        worker_block_right.classList.add('worker_block_right')
        salary.classList.add('salary')
        salary.innerHTML = item.salary + '$'
        best.classList.add('best')
        best.src = "./assets/img/photo_2022-10-31_20-20-45.jpg"
        del.classList.add('delete')
        del.src = "./assets/icons/352303_delete_icon.svg"
        star.classList.add('star')
        star.src = "./assets/icons/2792947_star_xmas_icon.svg"

        worker_block.append(worker_block_left, worker_block_right)
        worker_block_right.append(salary, best, del, star, inp_val_inp)
        workers.append(worker_block)

        if (item.increase) {
            star.style.display = 'block'
        } else {
            star.style.display = 'none'
        }

        if (item.rise) {
            worker_block_left.style.color = '#e09f3e'
            salary.style.color = '#e09f3e'
        } else {
            worker_block_left.style.color = 'black'
            salary.style.color = 'black'
        }



        salary.onclick = () => {
            inp_val_inp.style.display = 'block'
            salary.innerHTML = inp_val_inp.value
        }

        worker_block_left.onclick = () => {
            inp_val_inp.style.display = 'none'
            salary.innerHTML = inp_val_inp.value
        }

        worker_block_left.onclick = () => {

            if (item.increase) {
                axios.patch(`${url}/users/${item.id}`, {
                    increase: false
                }).then(res => fetchUser())
            } else {
                axios.patch(`${url}/users/${item.id}`, {
                    increase: true
                }).then(res => fetchUser())
            }
        }

        best.onclick = () => {
            if (item.rise) {
                axios.patch(`${url}/users/${item.id}`, {
                    rise: false
                }).then(res => fetchUser())

            } else {
                axios.patch(`${url}/users/${item.id}`, {
                    rise: true
                }).then(res => fetchUser())
            }
        }

        del.onclick = () => {
            axios.delete(`${url}/users/${item.id}`)
                .then(res => fetchUser())
        }

        mare.onclick = () => {
            if (item.salary >= 1000) {
                workers.append(worker_block)
            }
        }

    }
}