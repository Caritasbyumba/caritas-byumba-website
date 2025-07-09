<?php
equire 'vendor/autoload.php';
$client = new MongoDB\Client("mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/DATABASE?retryWrites=true&w=majority");
$collection = $client->test->users; // Example query
$collection->insertOne(["name" => "John"]);
echo "Connected to Atlas!";

$app = \Slim\Factory\AppFactory::create();

// Enable JSON parsing
$app->addBodyParsingMiddleware();

// Example route (replace with your API endpoints)
$app->get('/api/test', function ($request, $response) {
    $data = ['status' => 'success', 'message' => 'PHP backend is working!'];
    $response->getBody()->write(json_encode($data));
    return $response->withHeader('Content-Type', 'application/json');
});
$app->post('/api/users', function ($request, $response) {
    $data = $request->getParsedBody(); // Get POST data
    // Process data (e.g., save to database)
    return $response->withJson(['received' => $data]);
});
$app->run();