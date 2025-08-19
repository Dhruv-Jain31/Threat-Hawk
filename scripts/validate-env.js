const fs = require('fs');
const path = require('path');

const requiredEnvVars = {
    frontend: [
        'NEXTAUTH_SECRET',
        'NEXTAUTH_URL',
        'NEXT_PUBLIC_BACKEND_URL',
        'BACKEND_API_URL'
    ],
    backend: [
        'NEXTAUTH_SECRET',
        'DATABASE_URL',
        'FLASK_API_URL'
    ]
};

function validateEnvFile(envPath, requiredVars, name) {
    if (!fs.existsSync(envPath)) {
        console.error(`❌ Missing ${name} environment file: ${envPath}`);
        return false;
    }

    const envContent = fs.readFileSync(envPath, 'utf8');
    const missingVars = [];

    for (const varName of requiredVars) {
        if (!envContent.includes(`${varName}=`)) {
            missingVars.push(varName);
        }
    }

    if (missingVars.length > 0) {
        console.error(`❌ Missing required environment variables in ${name}:`);
        missingVars.forEach(varName => console.error(`   - ${varName}`));
        return false;
    }

    console.log(`✅ ${name} environment file is valid`);
    return true;
}

console.log('🔍 Validating environment files...\n');

const frontendValid = validateEnvFile(
    path.join(__dirname, '../frontend/.env.local'),
    requiredEnvVars.frontend,
    'Frontend (.env.local)'
);

const backendValid = validateEnvFile(
    path.join(__dirname, '../backend/.env'),
    requiredEnvVars.backend,
    'Backend (.env)'
);

if (frontendValid && backendValid) {
    console.log('\n🎉 All environment files are properly configured!');
    process.exit(0);
} else {
    console.log('\n❌ Please fix the missing environment variables before starting the application.');
    process.exit(1);
}
