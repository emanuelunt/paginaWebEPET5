<?php
header('Content-Type: application/json');

// Validar método
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
    exit;
}

// Obtener datos
$nombre   = filter_input(INPUT_POST, 'nombre', FILTER_SANITIZE_STRING);
$email    = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
$telefono = filter_input(INPUT_POST, 'telefono', FILTER_SANITIZE_STRING);
$asunto   = filter_input(INPUT_POST, 'asunto', FILTER_SANITIZE_STRING);
$mensaje  = filter_input(INPUT_POST, 'mensaje', FILTER_SANITIZE_STRING);

// Validaciones
$errors = [];

if (empty($nombre)) {
    $errors['nombre'] = 'Por favor ingrese su nombre completo';
}
if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors['email'] = 'Por favor ingrese un correo electrónico válido';
}
if (empty($asunto)) {
    $errors['asunto'] = 'Por favor seleccione un asunto';
}
if (empty($mensaje)) {
    $errors['mensaje'] = 'Por favor ingrese su mensaje';
}

if (!empty($errors)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'errors' => $errors]);
    exit;
}

// Mapeo de asuntos
$asuntos = [
    'informacion' => 'Información General',
    'admisiones'  => 'Admisiones',
    'academico'   => 'Consultas Académicas',
    'otro'        => 'Otro'
];

$asuntoDescripcion = $asuntos[$asunto] ?? 'Otro';

// Contenido HTML del mail
$email_body = "
<html>
<head>
    <title>Nuevo mensaje de contacto</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; }
        .header { background-color: #f1f1f1; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .label { font-weight: bold; color: #0d6efd; }
    </style>
</head>
<body>
    <div class='header'>
        <h2>Nuevo mensaje desde el formulario de contacto</h2>
    </div>
    <div class='content'>
        <p><span class='label'>Asunto:</span> $asuntoDescripcion</p>
        <p><span class='label'>Nombre:</span> $nombre</p>
        <p><span class='label'>Email:</span> $email</p>
        <p><span class='label'>Teléfono:</span> " . ($telefono ?: 'No proporcionado') . "</p>
        <p><span class='label'>Mensaje:</span><br>$mensaje</p>
    </div>
</body>
</html>
";

// ---------------------
//  ENVÍO CON PHPMailer
// ---------------------
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// SI USÁS COMPOSER:
// require 'vendor/autoload.php';

// SI SUBIS LA CARPETA PHPMailer MANUAL:
//use PHPMailer\PHPMailer;
//use PHPMailer\Exception;

require 'phpmailer/src/Exception.php';
require 'phpmailer/src/PHPMailer.php';
require 'phpmailer/src/SMTP.php';



// Configurar PHPMailer
$mail = new PHPMailer(true);

try {
    // SMTP
    $mail->isSMTP();
    $mail->Host = 'mail.epet5-santamaria.edu.ar';       // ⚠️ CAMBIAR
    $mail->SMTPAuth = true;
    $mail->Username = 'formularioweb@epet5-santamaria.edu.ar'; // ⚠️ CAMBIAR
    $mail->Password = 'ConsultasWeb.2025@epet5';            // ⚠️ CAMBIAR
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port = 465;
    
    // Para que acepte los acentos
    $mail->CharSet = 'UTF-8';


    // Remitente del dominio
    $mail->setFrom('formularioweb@epet5-santamaria.edu.ar', 'Consulta - Formulario Web de la escuela'); // ⚠️ CAMBIAR

    // Destinatario (vos)
    $mail->addAddress('tecnica5.santamaria@catamarca.edu.ar');

    // Responder al usuario
    $mail->addReplyTo($email, $nombre);

    // Contenido
    $mail->isHTML(true);
    $mail->Subject = "Nuevo mensaje de contacto: $asuntoDescripcion";
    $mail->Body    = $email_body;

    $mail->send();

    echo json_encode([
        'success' => true,
        'message' => '¡Gracias por contactarnos! Pronto nos comunicaremos contigo.'
    ]);
    


} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'No se pudo enviar el correo. Intente nuevamente más tarde.'
    ]);

    error_log("ERROR PHPMailer: " . $mail->ErrorInfo);
}
?>
