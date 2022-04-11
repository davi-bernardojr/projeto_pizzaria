let cart = []
let modalKey

const nd = (el) => {
    return document.querySelector(el)
}

const nds = (el) => {
    return document.querySelectorAll(el)
}

pizzaJson.map((item, index) => {
    let pizzaItem = nd('.models .pizza-item').cloneNode(true)

    pizzaItem.setAttribute('data-key', index)
    pizzaItem.querySelector('.pizza-item--img img').src = item.img
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description    
    pizzaItem.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault()

        let key = e.target.closest('.pizza-item').getAttribute('data-key')

        modalKey = key
        nd('.pizzaInfo h1').innerHTML = pizzaJson[key].name
        nd('.pizzaInfo--desc').innerHTML = pizzaJson[key].description
        nd('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`
        nd('.pizzaBig img').src = pizzaJson[key].img
        nd('.pizzaInfo--size.selected').classList.remove('selected')
        nds('.pizzaInfo--size').forEach((size, sizeIndex) => {
            if (sizeIndex == 2 ){
                size.classList.add('selected')
            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex]            
        })
        nd('.pizzaInfo--qt').innerHTML = 1

        nd('.pizzaWindowArea').style.opacity = 0
        nd('.pizzaWindowArea').style.display = 'flex'
        setTimeout(() => { nd('.pizzaWindowArea').style.opacity = 1 }, 200)
    })

    nd('.pizza-area').append( pizzaItem )
    
})

nd('.pizzaInfo--qtmais').addEventListener('click', () => {
    nd('.pizzaInfo--qt').innerHTML = parseInt(nd('.pizzaInfo--qt').innerHTML) + 1     
})

nd('.pizzaInfo--qtmenos').addEventListener('click', () => {
    if (parseInt(nd('.pizzaInfo--qt').innerHTML)> 1){
        nd('.pizzaInfo--qt').innerHTML = parseInt(nd('.pizzaInfo--qt').innerHTML) - 1     
    }
})

function fecharModal() {
    nd('.pizzaWindowArea').style.opacity = 0
    setTimeout(()=>{
        nd('.pizzaWindowArea').style.display = 'none'
    }, 500)
}

nds('.pizzaInfo--cancelMobileButton, .pizzaInfo--cancelButton').forEach((item)=>{
    item.addEventListener('click', fecharModal)
})

nds('.pizzaInfo--size').forEach((size, sizeIndex)=>{
    size.addEventListener('click', () => {
        nd('.pizzaInfo--size.selected').classList.remove('selected')
        size.classList.add('selected')
    })
})

nd('.pizzaInfo--addButton').addEventListener('click', () => {
    let identifier = pizzaJson[modalKey].id + '@' + nd('.pizzaInfo--size.selected').getAttribute('data-key')

    let key = cart.findIndex((item) => item.identifier == identifier)

    if (key > -1){
        cart[key].qt = parseInt(cart[key].qt) + parseInt(nd('.pizzaInfo--qt').innerHTML)
    } else {
        cart.push({
            identifier,
            id: pizzaJson[modalKey].id,
            size: nd('.pizzaInfo--size.selected').getAttribute('data-key'),
            qt: nd('.pizzaInfo--qt').innerHTML
        })
    }
    
    updateCarte()

    fecharModal()
})

nd('.menu-openner').addEventListener('click', () => {
    if (cart.length > 0){
        nd('aside').style.left = 0
    }
})
nd('.cart--area .menu-closer').addEventListener('click', () => {
    nd('aside').style.left = '100vw'
})

function updateCarte () {
    if (cart.length > 0){
        nd('aside').classList.add('show')

        nd('.cart--area .cart').innerHTML = ''

        let subtotal = 0 
        let desconto = 0 
        let total = 0 

        for(let i in cart){
            let pizzaItem = pizzaJson.find((item)=> item.id == cart[i].id)
            subtotal += pizzaItem.price * parseInt(cart[i].qt)

            let cartItem = nd('.models .cart--item').cloneNode(true)

            let pizzaSizeName
            switch(cart[i].size) {
                case '0':
                    pizzaSizeName = `P(${pizzaItem.sizes[cart[i].size]})`
                    break
                case '1':
                    pizzaSizeName = `M(${pizzaItem.sizes[cart[i].size]})`
                    break
                case '2':
                    pizzaSizeName = `G(${pizzaItem.sizes[cart[i].size]})`
                    break
            }
            
            let pizzaName = `${pizzaItem.name} - ${pizzaSizeName}`
            
            cartItem.querySelector('img').src = pizzaItem.img
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', (e) => {
                if (cart[i].qt > 1){
                    cart[i].qt--
                } else {
                    cart.splice(i, 1)
                }
                
                updateCarte()
                
            })
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', (e) => {
                cart[i].qt++
                updateCarte()                
            })

            nd('.cart--area .cart').append(cartItem)
        }

        desconto = subtotal * 0.1
        total = subtotal - desconto

        nd('.subtotal').children[1].innerHTML = `R$ ${subtotal.toFixed(2)}`
        nd('.desconto').children[1].innerHTML = `R$ ${desconto.toFixed(2)}`
        nd('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`

    } else {
        nd('aside').classList.remove('show')
        nd('aside').style.left = '100vw'
    }
    
    nd('.menu-openner span').innerHTML = cart.length    
}

