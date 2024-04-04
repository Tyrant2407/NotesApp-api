class NoteForm extends HTMLElement {
    _shadowRoot = null
    _style = null

    constructor() {
        super()

        this._shadowRoot = this.attachShadow({ mode: 'open' })
        this._style = document.createElement('style')

        // Bind event handlers
        this.onSubmit = this.onSubmit.bind(this)
        this.customValidationTitleHandler =
            this.customValidationTitleHandler.bind(this)
        this.customValidationBodyHandler =
            this.customValidationBodyHandler.bind(this)
    }

    _Style() {
        this._style.textContent = `
            #error-alert {
                margin-top: 10px;
                font-size: 14px;
            }
            form {
                max-width: 750px;
                margin: 20px auto;
                padding: 30px;
                background-color: #EEEEEE;
                border-radius: 10px;
                box-shadow: 0 5px 5px gray;
                display: flex;
                flex-direction: column;
                
            }
            h1 {
                margin-bottom: 20px; /* Atur jarak antara judul dan formulir */
                text-align: center; /* Pusatkan teks */
            }
            
            label {
                display: block;
                margin-bottom: 5px;
                font-size: 16px;
                color: black;
            }
            
            input[type="text"],
            textarea {
                width: calc(100% - 20px);
                padding: 10px;
                margin-bottom: 25px;
                border: 1px solid #ccc;
                border-radius: 6px;
                background-color: #fff;
                color: #333;
                font-size: 16px;
                box-sizing: border-box;
            }
            
            textarea {
                resize: vertical;
                min-height: 100px;
            }
            
            button[type="submit"] {
                padding: 10px 20px;
                border: none;
                border-radius: 4px;
                background-color: #5356FF;
                color: #fff;
                font-size: 16px;
                cursor: pointer;
                transition: background-color 0.3s ease;
            }
            
            button[type="submit"]:hover {
                background-color: #007F73;
            }
            
            @media screen and (max-width: 768px) {
                form {
                    max-width: 90%;
                }
                
                input[type="text"],
                textarea {
                    width: calc(100% - 20px); 
                }
                
                button[type="submit"] {
                    font-size: 14px;
                    padding: 8px 16px; 
                }
            }
            
            @media screen and (max-width: 480px) {
                input[type="text"],
                textarea {
                    font-size: 14px; 
                }
                
                button[type="submit"] {
                    font-size: 12px; 
                    padding: 6px 12px; 
                }
            }            
            
        `
    }

    _emptyContent() {
        this._shadowRoot.innerHTML = ''
    }

    connectedCallback() {
        this.render()
        this.setupEventListeners()
    }

    render() {
        this._emptyContent()
        this._Style()

        this._shadowRoot.appendChild(this._style)
        this._shadowRoot.innerHTML += `
        <form id="noteForm">
            <h1>Tambahkan Catatan Anda</h1>
            <label for="title">Judul</label>
            <input type="text" id="title" name="title" required minlength="1"><br><br>
            <p id="titleValidation" class="validation-message" aria-live="polite"></p>
            <label for="body">Body</label>
            <textarea id="body" name="body" rows="4" required></textarea>
            <p id="bodyValidation" class="validation-message" aria-live="polite"></p>
            <button type="submit" class="add-note">Tambah Catatan</button></button>
        </form>
      `

        this._shadowRoot
            .querySelector('#noteForm')
            .addEventListener('submit', this.onSubmit)
    }

    onSubmit(event) {
        event.preventDefault()
        const title = this._shadowRoot.querySelector('#title').value
        const body = this._shadowRoot.querySelector('#body').value

        const addNoteEvent = new CustomEvent('addNote', {
            detail: { title, body },
            bubbles: true,
            composed: true,
        })
        this.dispatchEvent(addNoteEvent)

        this._shadowRoot.querySelector('#title').value = ''
        this._shadowRoot.querySelector('#body').value = ''
    }

    setupEventListeners() {
        const titleInput = this._shadowRoot.querySelector('#title')
        const bodyInput = this._shadowRoot.querySelector('#body')

        titleInput.addEventListener('input', this.customValidationTitleHandler)
        bodyInput.addEventListener('input', this.customValidationBodyHandler)
    }

    customValidationTitleHandler(event) {
        const titleInput = event.target
        const titleValidationMessage =
            this._shadowRoot.querySelector('#titleValidation')

        if (!titleInput.value.trim()) {
            titleValidationMessage.innerText = 'Title is required.'
        } else {
            titleValidationMessage.innerText = ''
        }
    }

    customValidationBodyHandler(event) {
        const bodyInput = event.target
        const bodyValidationMessage =
            this._shadowRoot.querySelector('#bodyValidation')

        if (!bodyInput.value.trim()) {
            bodyValidationMessage.innerText = 'Body is required.'
        } else {
            bodyValidationMessage.innerText = ''
        }
    }
}

customElements.define('form-input', NoteForm)
