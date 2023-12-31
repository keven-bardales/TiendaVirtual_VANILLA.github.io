export const API = {
  BASE: 'https://apipw1.myferby.com/ws.php?',
  TK: 'tk=t308218823',
  URL: '',
}

API.URL = API.BASE + API.TK + '&op='

export const getCategorias = async () => {
  const response = await fetch(`${API.URL}categorias`)
  const datos = await response.json()
  const activas = datos.categorias.filter((categoria) => categoria.estado != 0)
  const promesas = await activas.map(async (categoria) => {
    const tieneProductos = await getProductosByCategoria(categoria.id)
    if (tieneProductos) return categoria
  })

  let categoriasConProducto = await Promise.all(promesas)

  categoriasConProducto = categoriasConProducto.filter(
    (tieneProducto) => tieneProducto
  )

  return categoriasConProducto
}

export const getProductosByCategoria = async (id) => {
  const funcion = `productos_categoria&cat=${id}`
  const response = await fetch(`${API.URL}${funcion}`)
  const datos = await response.json()

  if (!datos.productos) {
    return false
  }
  const arrayProductos = datos.productos.filter(
    (producto) => producto.estado != 0
  )

  return arrayProductos
}

export const validarUsuario = async ({ username, password }) => {
  const funcion = `login&username=${username}&password=${password}`
  const response = await fetch(`${API.URL}${funcion}`)
  return await response.json()
}

export const getChat = async (mensaje) => {
  const funcion = `buscar_palabra&palabras=${mensaje}`
  const response = await fetch(`${API.URL}${funcion}`)
  const data = await response.json()
  return data.chat[0]
}

export const sendCheckout = async ({
  cliente,
  direccion,
  tipo_pago,
  digitos,
  cvv,
  fecha,
  titular,
}) => {
  try {
    const funcion = `create_checkout&cliente=${cliente}&direccion=${direccion}&tipo_pago=${tipo_pago}&digitos=${digitos}&cvv=${cvv}&fecha=${fecha}&titular=${titular}`
    const response = await fetch(`${API.URL}${funcion}`)
    const data = await response.json()
    console.log(data)
    return data
  } catch (error) {
    console.log(error)
    return false
  }
}

export const registrarUsuario = async ({
  username,
  password,
  nombre,
  email,
  cargo,
}) => {
  const funcion = `create_usuario&username=${username}&password=${password}&nombre=${nombre}&email=${email}&cargo=${cargo}`
  const response = await fetch(`${API.URL}${funcion}`)
  const datos = await response.json()
  return datos
}

export const getTiposPago = async () => {
  const funcion = `tipos_pago`
  const response = await fetch(`${API.URL}${funcion}`)
  const data = await response.json()

  const tiposPagos = data.tipos_pagos.map((pago) => {
    return { nombrePago: pago.nombre, id: pago.id }
  })

  return tiposPagos
}
