# Funcionalidades de la Web App Panza Verde

## 📋 Índice
1. [Dashboard de Administración](#dashboard-de-administración)
2. [Gestión de Productos](#gestión-de-productos)
3. [Gestión de Categorías](#gestión-de-categorías)
4. [Gestión de Pedidos](#gestión-de-pedidos)
5. [Gestión de Blog](#gestión-de-blog)
6. [Gestión de Inventario](#gestión-de-inventario)
7. [Business Manager con IA](#business-manager-con-ia)
8. [Gestión de Usuarios y Compradores](#gestión-de-usuarios-y-compradores)
9. [Formularios de Contacto](#formularios-de-contacto)
10. [Chatbot con IA](#chatbot-con-ia)
11. [Tienda Online](#tienda-online)
12. [Analíticas y Estadísticas](#analíticas-y-estadísticas)

---

## 🎛️ Dashboard de Administración

### Características Principales
- **Panel de Control Centralizado**: Vista general de todas las métricas importantes del negocio
- **Estadísticas en Tiempo Real**: 
  - Total de productos
  - Valor del inventario
  - Pedidos totales
  - Ingresos totales
- **Indicador de Conexión**: Muestra el estado de conexión con Firebase en tiempo real
- **Navegación Intuitiva**: Menú lateral con acceso rápido a todas las secciones
- **Animación de Bienvenida**: Animación personalizada al acceder al dashboard
- **Diseño Responsive**: Funciona perfectamente en desktop, tablet y móvil

### Acceso
- URL: `/admin.html`
- Credenciales: `erandi@panzaverde.store`

---

## 📦 Gestión de Productos

### Funcionalidades
- **Crear Productos**: Agregar nuevos productos con nombre, precio, categoría, imagen y descripción
- **Editar Productos**: Modificar información de productos existentes
- **Eliminar Productos**: Remover productos del catálogo
- **Lista de Productos**: Visualización de todos los productos con búsqueda y filtros
- **Productos Destacados**: Marcar productos como destacados para mostrarlos en la página principal
- **Carga Masiva**: Opción para cargar productos iniciales del catálogo
- **Sincronización en Tiempo Real**: Los cambios se reflejan inmediatamente en la tienda

### Campos de Producto
- Nombre del producto
- Precio (MXN)
- Categoría (Dulces, Dulces picositos, Botanas, Otros)
- URL de imagen
- Descripción/Ingredientes
- Producto destacado (checkbox)

---

## 🏷️ Gestión de Categorías

### Funcionalidades
- **Crear Categorías**: Agregar nuevas categorías de productos
- **Editar Categorías**: Modificar nombres de categorías
- **Eliminar Categorías**: Remover categorías (con validación de productos asociados)
- **Lista de Categorías**: Visualización de todas las categorías disponibles
- **Sincronización Automática**: Los cambios se reflejan en la tienda inmediatamente

---

## 🛒 Gestión de Pedidos

### Funcionalidades
- **Visualización de Pedidos**: Lista completa de todos los pedidos recibidos
- **Estados de Pedido**: 
  - Pendiente
  - Confirmado
  - En preparación
  - Enviado
  - Entregado
  - Cancelado
- **Actualización de Estado**: Cambiar el estado de los pedidos con un menú desplegable
- **Información Detallada**: 
  - Número de pedido
  - Cliente (nombre y email)
  - Fecha y hora
  - Productos y cantidades
  - Total del pedido
  - Método de pago
- **Acciones Rápidas**:
  - Enviar email al cliente
  - Contactar por WhatsApp
  - Eliminar pedido
- **Búsqueda y Filtrado**: Buscar pedidos por cliente, número o estado
- **Sincronización en Tiempo Real**: Los nuevos pedidos aparecen automáticamente

---

## 📝 Gestión de Blog

### Funcionalidades
- **Crear Artículos**: Escribir nuevos artículos del blog con editor completo
- **Editar Artículos**: Modificar artículos existentes
- **Eliminar Artículos**: Remover artículos del blog
- **Publicar/Borrador**: Control de publicación de artículos
- **Campos del Artículo**:
  - Título
  - Contenido (HTML permitido)
  - Resumen/Excerpt
  - Autor
  - Categoría
  - Imagen destacada
  - Fecha de publicación
- **Vista Previa**: Ver el artículo completo antes de publicar
- **Generación con IA**: Crear artículos SEO optimizados usando DeepSeek AI
- **Sincronización Automática**: Los artículos publicados aparecen en la tienda inmediatamente

### Visualización en Tienda
- Los artículos se muestran en la sección de blog de la página principal
- Solo se muestran artículos publicados
- Máximo 3 artículos más recientes en la página principal
- Botón "Leer más" para ver el artículo completo

---

## 📊 Gestión de Inventario

### Funcionalidades
- **Registro de Inventario**: Agregar cantidad disponible para cada producto
- **Actualización en Tiempo Real**: Modificar cantidades según ventas y compras
- **Vista de Inventario**: Lista completa con productos y sus cantidades
- **Alertas de Stock Bajo**: Notificaciones cuando el inventario es bajo
- **Valor Total del Inventario**: Cálculo automático del valor total
- **Sincronización Automática**: Los cambios se reflejan inmediatamente

---

## 🤖 Business Manager con IA

### Funcionalidades
- **Gestión de Inventario Avanzada**: Control detallado de stock por producto
- **Analíticas con IA**: 
  - Análisis de ventas
  - Productos más vendidos
  - Tendencias de compra
  - Recomendaciones de inventario
- **Generación de Reportes**: Crear reportes detallados con datos del negocio
- **Descarga de Datos**: Exportar datos en formato CSV o JSON
- **Insights Inteligentes**: La IA analiza los datos y proporciona recomendaciones
- **Integración con DeepSeek**: Análisis avanzado usando inteligencia artificial

### Datos Analizados
- Total de productos
- Total de pedidos
- Ingresos totales
- Productos más vendidos
- Clientes más frecuentes
- Tendencias temporales

---

## 👥 Gestión de Usuarios y Compradores

### Funcionalidades
- **Lista de Usuarios**: Visualización de todos los usuarios registrados
- **Lista de Compradores**: Vista específica de clientes con historial de compras
- **Información del Cliente**:
  - Nombre
  - Email
  - Total de pedidos
  - Total gastado
  - Promedio por pedido
  - Último pedido
- **Acciones**:
  - Ver historial de pedidos de un cliente
  - Enviar email al cliente
  - Eliminar usuario (con confirmación)
- **Búsqueda**: Buscar usuarios por nombre o email

---

## 📧 Formularios de Contacto

### Funcionalidades
- **Recepción de Contactos**: Todos los formularios enviados desde el chatbot se guardan aquí
- **Información Capturada**:
  - Nombre
  - Email
  - Teléfono (opcional)
  - Mensaje
  - Fecha y hora
  - URL de origen
- **Estados de Contacto**:
  - Nuevo (azul)
  - Leído (naranja)
  - Respondido (verde)
- **Gestión de Contactos**:
  - Cambiar estado del contacto
  - Responder por email (con plantilla prellenada)
  - Contactar por WhatsApp (si hay teléfono)
  - Eliminar contacto
- **Búsqueda**: Buscar contactos por nombre, email, teléfono o mensaje
- **Sincronización en Tiempo Real**: Los nuevos contactos aparecen automáticamente

---

## 💬 Chatbot con IA

### Funcionalidades del Chatbot de Tienda
- **Asistente Virtual**: Chatbot disponible en la esquina inferior derecha
- **Información de Productos**: El chatbot conoce todos los productos y puede ayudar a los clientes
- **Formulario de Contacto**: Opción para que los clientes se pongan en contacto directamente
- **Integración con DeepSeek AI**: Respuestas inteligentes usando inteligencia artificial
- **Diseño Responsive**: Optimizado para móviles iOS y Android

### Funcionalidades del Chatbot de Admin
- **Asistente de Administración**: Chatbot especializado para ayudar con tareas administrativas
- **Análisis con IA**: Generar insights sobre el negocio
- **Generación de Contenido**: Crear contenido para el blog usando IA
- **Entrenamiento Personalizado**: Agregar datos de entrenamiento específicos del negocio
- **Acceso a Datos**: El chatbot tiene acceso a productos, pedidos, inventario y estadísticas

---

## 🛍️ Tienda Online

### Funcionalidades para Clientes
- **Catálogo de Productos**: Visualización de todos los productos disponibles
- **Filtrado por Categoría**: Filtrar productos por categorías (Dulces, Dulces picositos, Botanas, Otros)
- **Productos Destacados**: Sección especial para productos destacados
- **Carrito de Compras**: Agregar productos al carrito y gestionar cantidades
- **Proceso de Pedido**:
  - Selección de productos
  - Métodos de pago (En línea, Efectivo, Transferencia)
  - Información del cliente
  - Confirmación de pedido
- **Historial de Pedidos**: Los usuarios registrados pueden ver su historial
- **Sección de Blog**: Artículos del blog sobre dulcería mexicana
- **Chatbot de Ayuda**: Asistente virtual para resolver dudas
- **Formulario de Contacto**: Opción para contactar directamente
- **Diseño Responsive**: Funciona perfectamente en todos los dispositivos

### Características Técnicas
- **Sincronización en Tiempo Real**: Los productos y precios se actualizan automáticamente
- **Autenticación de Usuarios**: Sistema de registro e inicio de sesión
- **Integración con PayPal**: Pagos en línea (configurable)
- **Optimización Móvil**: Interfaz optimizada para iOS y Android

---

## 📈 Analíticas y Estadísticas

### Métricas Disponibles
- **Total de Productos**: Cantidad de productos en el catálogo
- **Valor del Inventario**: Valor total calculado de todo el inventario
- **Pedidos Totales**: Número total de pedidos recibidos
- **Ingresos Totales**: Suma de todos los pedidos
- **Productos Más Vendidos**: Ranking de productos por ventas
- **Clientes Más Frecuentes**: Clientes con más pedidos
- **Tendencias Temporales**: Análisis de ventas por período

### Reportes
- **Exportación de Datos**: Descargar datos en CSV o JSON
- **Análisis con IA**: Insights generados por inteligencia artificial
- **Visualizaciones**: Gráficos y tablas de datos

---

## 🔐 Seguridad y Permisos

### Control de Acceso
- **Autenticación de Admin**: Solo usuarios autorizados pueden acceder al dashboard
- **Firebase Security Rules**: Reglas de seguridad para proteger los datos
- **Permisos Granulares**: Control de lectura/escritura por colección

### Datos Protegidos
- Información de usuarios
- Pedidos y datos de clientes
- Inventario y productos
- Configuraciones administrativas

---

## 🚀 Características Técnicas

### Tecnologías Utilizadas
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Firebase (Firestore, Authentication)
- **IA**: DeepSeek API integrada vía Vercel Serverless Functions
- **Hosting**: Vercel (para funciones serverless)
- **Base de Datos**: Firebase Firestore (tiempo real)

### Optimizaciones
- **Carga en Tiempo Real**: Todos los datos se sincronizan en tiempo real
- **Debouncing**: Optimización de actualizaciones rápidas
- **Gestión de Memoria**: Limpieza automática de suscripciones
- **Conexión Offline**: Indicadores de estado de conexión
- **Reintentos Automáticos**: Reconexión automática en caso de error

---

## 📱 Compatibilidad

### Dispositivos Soportados
- ✅ Desktop (Windows, macOS, Linux)
- ✅ Tablets (iPad, Android)
- ✅ Móviles (iOS, Android)
- ✅ Navegadores modernos (Chrome, Firefox, Safari, Edge)

### Características Móviles
- Diseño responsive
- Soporte para áreas seguras de iOS
- Optimización táctil
- Carga rápida

---

## 🎨 Características de UX/UI

### Interfaz de Usuario
- **Diseño Moderno**: Interfaz limpia y profesional
- **Animaciones Suaves**: Transiciones y animaciones fluidas
- **Feedback Visual**: Notificaciones y mensajes claros
- **Navegación Intuitiva**: Menús y secciones fáciles de usar
- **Temas y Colores**: Paleta de colores consistente con la marca

### Experiencia de Usuario
- **Carga Rápida**: Optimización para velocidad
- **Feedback Inmediato**: Confirmaciones de acciones
- **Mensajes de Error Claros**: Errores explicados de forma comprensible
- **Ayuda Contextual**: Tooltips y mensajes de ayuda

---

## 📞 Soporte y Ayuda

### Recursos Disponibles
- **Tutorial Integrado**: Sección de ayuda y tutorial en el dashboard
- **Generación de Ayuda con IA**: Crear contenido de ayuda personalizado
- **Documentación**: Guías y documentación técnica disponible

---

## 🔄 Actualizaciones y Mantenimiento

### Sincronización Automática
- Todos los datos se sincronizan en tiempo real
- Los cambios se reflejan inmediatamente en todas las vistas
- No se requiere recargar la página

### Backup y Recuperación
- Datos almacenados en Firebase (backup automático)
- Historial de cambios disponible
- Recuperación de datos en caso de error

---

## 📝 Notas Importantes

1. **Credenciales de Admin**: Solo `erandi@panzaverde.store` puede acceder al dashboard
2. **Publicación de Blog**: Los artículos deben marcarse como "publicados" para aparecer en la tienda
3. **Inventario**: El inventario se actualiza manualmente, no se descuenta automáticamente de los pedidos
4. **Chatbot**: Requiere configuración de API key de DeepSeek en Vercel
5. **Pagos**: La integración de PayPal requiere configuración adicional

---

## 🎯 Próximas Mejoras (Roadmap)

- [ ] Descuento automático de inventario al crear pedidos
- [ ] Notificaciones por email de nuevos pedidos
- [ ] Dashboard de analíticas más detallado
- [ ] Integración con servicios de envío
- [ ] App móvil nativa
- [ ] Sistema de cupones y descuentos
- [ ] Programa de fidelidad
- [ ] Integración con redes sociales

---

**Última actualización**: Diciembre 2024
**Versión**: 1.0
**Desarrollado para**: Panza Verde - Dulcería Mexicana

