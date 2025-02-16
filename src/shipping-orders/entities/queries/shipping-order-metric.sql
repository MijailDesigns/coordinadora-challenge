WITH shipping_order_delivered AS (
    SELECT 
        id,
        TIMESTAMPDIFF(SECOND, createdAt, COALESCE(deliveredAt, NOW())) AS tiempo_segundos,
        deliveredAt
    FROM shipping_order 
    WHERE estado = 'ENTREGADO'
)
SELECT 
    so.id AS shippingOrderId,
    so.tipoProducto AS tipoProducto,
    so.peso AS shippingOrderPeso,
    so.alto AS shippingOrderAlto,
    so.largo AS shippingOrderLargo,
    so.ancho AS shippingOrderAncho, 
    so.estado AS shippingOrderStatus,
    so.createdAt AS shippingOrderCreatedAt,
    so.direccionDestinatario AS shippingOrderDestinatario,
    so.direccionRemitente AS shippingOrderRemitente,
    so.onTheRouteAt AS shippingOrderOnTheRouteAt,
    so.deliveredAt AS shippingOrderDeliveredAt,

    -- Tiempo total desde recepción hasta entrega
    CONCAT(
        FLOOR(IFNULL(AVG(sod.tiempo_segundos), 0) / 86400), ' días, ',
        LPAD(FLOOR(MOD(IFNULL(AVG(sod.tiempo_segundos), 0), 86400) / 3600), 2, '0'), ' horas, ',
        LPAD(FLOOR(MOD(IFNULL(AVG(sod.tiempo_segundos), 0), 3600) / 60), 2, '0'), ' minutos, ',
        LPAD(MOD(IFNULL(AVG(sod.tiempo_segundos), 0), 60), 2, '0'), ' segundos'
    ) AS tiempoRecepcionToEntrega,

    -- Tiempo total en ruta
    CONCAT(
        FLOOR(IFNULL(AVG(TIMESTAMPDIFF(SECOND, so.onTheRouteAt, COALESCE(so.deliveredAt, NOW()))), 0) / 86400), ' días, ',
        LPAD(FLOOR(MOD(IFNULL(AVG(TIMESTAMPDIFF(SECOND, so.onTheRouteAt, COALESCE(so.deliveredAt, NOW()))), 0), 86400) / 3600), 2, '0'), ' horas, ',
        LPAD(FLOOR(MOD(IFNULL(AVG(TIMESTAMPDIFF(SECOND, so.onTheRouteAt, COALESCE(so.deliveredAt, NOW()))), 0), 3600) / 60), 2, '0'), ' minutos, ',
        LPAD(MOD(IFNULL(AVG(TIMESTAMPDIFF(SECOND, so.onTheRouteAt, COALESCE(so.deliveredAt, NOW()))), 0), 60), 2, '0'), ' segundos'
    ) AS tiempoEnRuta,

    r.id AS routeId,
    r.origen AS routeOrigen,
    r.destino AS routeDestino,
    r.ubicacionActual AS routeUbicacionActual,
    r.inicioRuta AS routeInicioRuta,
    r.finalizoRuta AS routeFinalizoRuta,
    r.fechaInicio AS routeFechaInicio,
    r.fechaFinalizacion AS routeFechaFinalizacion, 
    
    d.id AS driverId,
    d.nombre AS driverName,
    d.licencia AS driverLicencia,
    d.isAvailable AS driverIsAvailable,
    
    COUNT(sod.id) AS numero_entregas,
    COALESCE(AVG(sod.tiempo_segundos), 0) AS tiempo_promedio,
    MAX(sod.deliveredAt) AS fecha_entrega

FROM shipping_order so
LEFT JOIN route r ON so.routeId = r.id
LEFT JOIN driver d ON r.driverId = d.id
LEFT JOIN shipping_order_delivered sod ON so.id = sod.id

GROUP BY d.id, so.id, r.id;
