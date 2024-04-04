class AppBar extends HTMLElement {
    _shadowRoot = null
    _style = null

    constructor() {
        super()

        this._shadowRoot = this.attachShadow({
            mode: 'open',
        })
        this._style = document.createElement('style')
    }

    _updateStyle() {
        this._style.textContent = `
          :host {
            display: block;
            width: 100%;
            
            color: white;
            background-color: #00224D;
            box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.2);
          }
     
          div {
            padding: 37px 20px;
            text-align: center;
          }
     
          .brand-name {
            margin: 0;
            font-size: 2.5em;
        `
    }

    _emptyContent() {
        this._shadowRoot.innerHTML = ''
    }

    connectedCallback() {
        this.render()
    }

    render() {
        this._emptyContent()
        this._updateStyle()

        this._shadowRoot.appendChild(this._style)
        this._shadowRoot.innerHTML += `      
          <div>
            <h1 class="brand-name">Notes App</h1>
          </div>
        `
    }
}

customElements.define('app-bar', AppBar)
