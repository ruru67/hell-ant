export class HTML{
    static eol(){
        return "<br />"
    }
    static add(type,textContent,classe){
        let elt=document.createElement(type)
        if(textContent)
            elt.textContent=textContent
        if(classe)
            elt.className=classe
        return elt
    }
    static addDiv(classe,textContent){
        return this.add("div",textContent,classe)
    }
    static addP(textContent,classe){
        return this.add("p",textContent,classe)
    }
    static addH(textContent,size=1,classe){
        return this.add("h"+size,textContent,classe)
    }
    static addButton(textContent,classe){
        return this.add("button",textContent,classe)

    }
    static addLabel(textContent,classe){
        return this.add("label",textContent,classe)
    }

    static loadcssfile(file){
        let head0=document.getElementsByTagName('head')[0]
        const style=document.createElement('style')
        style.innerHTML=file
        head0.appendChild(style)
    }
}

/**
 * 
 * @param {string} id 
 * @returns {DocumentFragment}
 */
export function cloneTemplate(id){
    return document.getElementById(id).content.cloneNode(true)
}