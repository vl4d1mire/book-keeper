const bookmarkContainer = document.getElementById('bookmark-container')
const modal = document.getElementById('modal')
const showModal = document.getElementById('show-modal')
const closeModal = document.getElementById('close-modal')
const websiteNameEl = document.getElementById('website-name')
const bookmarkForm = document.getElementById('bookmark-form')

let bookmarks = {}

function openModal() {
    modal.classList.add('show-modal')
    websiteNameEl.focus()
}

function hideModal() {
    modal.classList.remove('show-modal')
}

showModal.addEventListener('click', openModal)
closeModal.addEventListener('click', hideModal)
window.addEventListener('click', (e) => e.target === modal ? hideModal() : modal)

function validate(name, url) {
    const expression = /(https)?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/g;
    const regexp = new RegExp(expression)

    if (!name || !url) {
        alert('Please submit valuer for both fields')
        return false
    }

    if (!url.match(regexp)) {
        alert('Please provide a valid web address!')
        return false
    }
    return true
}

function buildBookmarks() {
    bookmarkContainer.textContent = ''
    Object.keys(bookmarks).forEach(id => {
        const {name, url} = bookmarks[id]
        const item = document.createElement('div')
        item.classList.add('item')
        const closeIcon = document.createElement('i')
        closeIcon.classList.add('fas', 'fa-times')
        closeIcon.setAttribute('title', 'Delete Bookmarks')
        closeIcon.setAttribute('onclick', `deleteBookmark('${id}')`)
        const linkInfo = document.createElement('div')
        linkInfo.classList.add('name')
        const favicon = document.createElement('img')
        favicon.setAttribute('src', `https://s2.googleusercontent.com/s2/favicons?domain=${url}`)
        favicon.setAttribute('alt', 'Favicon')
        const link = document.createElement('a')
        link.setAttribute('href', `${url}`)
        link.setAttribute('target', '_blank')
        link.textContent = name

        linkInfo.append(favicon, link)
        item.append(closeIcon, linkInfo)
        bookmarkContainer.appendChild(item)
    })
}

function fetchBookmarks() {
    if (localStorage.getItem('bookmarks')) {
        bookmarks = JSON.parse(localStorage.getItem('bookmarks'))
    } else {
        const id = 'https://google.com'
        bookmarks[id] = {
            name: 'google',
            url: 'https://google.com'
        }
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks))
    }
    buildBookmarks()
}

function deleteBookmark(id) {
    if (bookmarks[id]) {
        delete bookmarks[id]
    }
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks))
    fetchBookmarks()
}

function bookmarkHandler(e) {
    e.preventDefault()
    const nameValue = e.srcElement[0].value
    let urlValue = e.srcElement[1].value

    if (!urlValue.includes('http://') || 'https://') {
        urlValue = `http://${urlValue}`
    }

    if (!validate(nameValue, urlValue)) {
        return
    }

    const id = urlValue
    bookmarks[id] = {
        name: nameValue,
        url: urlValue
    }

    localStorage.setItem('bookmarks', JSON.stringify(bookmarks))

    fetchBookmarks()
    bookmarkForm.reset()
    websiteNameEl.focus()
}

bookmarkForm.addEventListener('submit', bookmarkHandler)

fetchBookmarks()
