console.log("🚀 gRPC server starting...");

const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const userService = require('./services/userService');

const PROTO_PATH = path.join(__dirname, 'proto', 'user.proto');

// Load proto
const packageDef = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});
const grpcObj = grpc.loadPackageDefinition(packageDef);

// 🔑 Access the package exactly as defined in proto
const userPackage = grpcObj.user;
if (!userPackage) {
    console.error('❌ grpcObj.user is undefined! Check proto package name.');
    process.exit(1);
}

// gRPC methods
async function GetUser(call, callback) {
    try {
        const id = Number(call.request.id);
        const user = await userService.getUser(id);
        if (!user) {
            return callback({
                code: grpc.status.NOT_FOUND,
                message: 'User not found'
            });
        }
        callback(null, user);
    } catch (err) {
        callback({
            code: grpc.status.INTERNAL,
            message: err.message
        });
    }
}

async function CreateUser(call, callback) {
    try {
        const { name, email } = call.request;
        if (!name || !email) {
            return callback({
                code: grpc.status.INVALID_ARGUMENT,
                message: 'Name and email required'
            });
        }
        const user = await userService.createUser({ name, email });
        callback(null, user);
    } catch (err) {
        callback({
            code: grpc.status.INTERNAL,
            message: err.message
        });
    }
}

// Create gRPC server
const server = new grpc.Server();

// ✅ Add service correctly
server.addService(userPackage.userService.service, {
    GetUser,
    CreateUser
});

// Bind & start
server.bindAsync(
    '0.0.0.0:50051',
    grpc.ServerCredentials.createInsecure(),
    (err, port) => {
        if (err) {
            console.error('❌ Server binding error:', err);
            return;
        }
        server.start();
        console.log(`✅ gRPC Server running on port ${port}`);
    }
);
