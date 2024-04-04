function showResponseMessage(message = 'Check your internet connection') {
    alert(message)
}

function Home() {
    const baseUrl = 'https://notes-api.dicoding.dev/v2'
    const searchFormElement = document.querySelector('search-bar')

    const getUnArchived = () => {
        showLoadingSpinner()

        fetch(`${baseUrl}/notes`)
            .then((response) => {
                return response.json()
            })
            .then((responseJson) => {
                if (responseJson.data.length > 0) {
                    render(responseJson.data)
                } else {
                    showResponseMessage(
                        'Catatan pada Unarchived tidak ditemukan'
                    )
                    render(responseJson.data)
                }
            })
            .catch((error) => {
                showResponseMessage(error)
            })
            .finally(() => {
                hideLoadingSpinner()
            })
    }

    const getArchived = () => {
        showLoadingSpinner()

        fetch(`${baseUrl}/notes/archived`)
            .then((response) => {
                return response.json()
            })
            .then((responseJson) => {
                if (responseJson.data.length > 0) {
                    render(responseJson.data)
                } else {
                    showResponseMessage('Catatan pada Archived tidak ditemukan')
                    render(responseJson.data)
                }
            })
            .catch((error) => {
                showResponseMessage(error)
            })
            .finally(() => {
                hideLoadingSpinner()
            })
    }

    const addNote = (note) => {
        showLoadingSpinner()
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(note),
        }

        fetch(`${baseUrl}/notes`, options)
            .then((response) => {
                return response.json()
            })
            .then((responseJson) => {
                showResponseMessage(responseJson.message)
                getUnArchived()
            })
            .catch((error) => {
                showResponseMessage(error)
            })
            .finally(() => {
                hideLoadingSpinner()
            })
    }

    const removeNote = (noteId) => {
        showLoadingSpinner()
        fetch(`${baseUrl}/notes/${noteId}`, {
            method: 'DELETE',
        })
            .then((response) => {
                return response.json()
            })
            .then((responseJson) => {
                showResponseMessage(responseJson.message)
                if (filterNotes.selectedIndex == 0) {
                    getUnArchived()
                } else {
                    getArchived()
                }
            })
            .catch((error) => {
                showResponseMessage(error)
            })
            .finally(() => {
                hideLoadingSpinner()
            })
    }

    const archiveNote = (id) => {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        }

        fetch(`${baseUrl}/notes/${id}/archive`, options)
            .then((response) => {
                return response.json()
            })
            .then((responseJson) => {
                showResponseMessage(responseJson.message)
                getUnArchived()
            })
            .catch((error) => {
                showResponseMessage(error)
            })
    }

    const unArchiveNote = async (id) => {
        try {
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
            const response = await fetch(
                `${baseUrl}/notes/${id}/unarchive`,
                options
            )
            const responseJson = await response.json()
            showResponseMessage(responseJson.message)
            getArchived()
        } catch (error) {
            showResponseMessage(error)
        }
    }

    const render = (notes) => {
        const noteListElement = document.querySelector('#noteList')
        noteListElement.innerHTML = ''

        notes.forEach((note) => {
            const noteItem = document.createElement('div')
            noteItem.classList.add('note-item')
            noteItem.setAttribute('tabindex', '0')

            const noteTitle = document.createElement('h3')
            noteTitle.classList.add('note-title')
            noteTitle.innerText = note.title

            const noteBody = document.createElement('p')
            noteBody.classList.add('note-body')
            noteBody.innerText = note.body

            const buttonArchived = document.createElement('button')
            buttonArchived.setAttribute('type', 'button')

            const buttonTrash = document.createElement('button')
            buttonTrash.classList.add('button-delete')
            buttonTrash.setAttribute('type', 'button')
            buttonTrash.addEventListener('click', function () {
                const confirmation = confirm(
                    'Apakah anda yakin ingin menghapus?'
                )
                if (confirmation) {
                    removeNote(note.id)
                }
            })

            if (note.archived) {
                buttonArchived.classList.add('button-non-archived')
                buttonArchived.addEventListener('click', function () {
                    unArchiveNote(note.id)
                })
            } else {
                buttonArchived.classList.add('button-archived')
                buttonArchived.addEventListener('click', function () {
                    archiveNote(note.id)
                })
            }

            const buttonContainer = document.createElement('div')
            buttonContainer.classList.add('action')
            buttonContainer.append(buttonArchived, buttonTrash)

            noteItem.append(noteTitle, noteBody, buttonContainer)
            noteListElement.appendChild(noteItem)
        })
    }

    const showSportNotesData = async (query) => {
        try {
            const response = await fetch(`${baseUrl}/notes?q=${query}`)
            if (!response.ok) {
                throw new Error('Network response was not ok')
            }
            const result = await response.json()

            if (result.data.length === 0) {
                // Jika kosong, tampilkan kembali noteList
                document.getElementById('noteList').style.display = 'block'
            } else {
                document.getElementById('noteList').style.display = 'none'
            }
        } catch (error) {
            console.error('Error fetching data:', error)
        }
    }

    const onSearchHandler = (event) => {
        event.preventDefault()
        const { query } = event.detail
        showSportNotesData(query)
    }

    document.addEventListener('DOMContentLoaded', () => {
        getUnArchived()
        filterNotes.selectedIndex = 0
    })

    document.addEventListener('addNote', function (event) {
        const { title, body } = event.detail

        const newNote = {
            title: title,
            body: body,
        }

        addNote(newNote)
        filterNotes.selectedIndex = 0
    })

    const showLoadingSpinner = () => {
        document.getElementById('loadingSpinner').style.display = 'block'
    }

    const hideLoadingSpinner = () => {
        document.getElementById('loadingSpinner').style.display = 'none'
    }

    const filterNotes = document.getElementById('filterNotes')

    filterNotes.addEventListener('change', function () {
        if (filterNotes.selectedIndex == 0) {
            getUnArchived()
        } else {
            getArchived()
        }
    })

    searchFormElement.addEventListener('search', onSearchHandler)
}

export default Home
