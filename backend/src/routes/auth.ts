import express, { Request, Response, RequestHandler } from 'express';
import prisma from '../client';
import bcrypt from 'bcrypt';

const router = express.Router();

// Type for login request body
interface LoginRequestBody {
  email?: string;
  password?: string;
}

// Type for OAuth request body
interface OAuthRequestBody {
  email?: string;
  name?: string;
  provider?: string;
  providerAccountId?: string;
  username?: string; // Optional GitHub username
}

//TS2769: No overload matches this call error indicates that TypeScript is
//still misinterpreting the route handler function in backend/src/routes/auth.ts as an Application type (an Express app) instead of a RequestHandler
// Login handler with explicit RequestHandler type
//To resolve the TS2769 error, we’ll:
//Explicitly type the handler as express.RequestHandler to force TypeScript to recognize it correctly.
//Ensure all code paths return a Response to avoid Promise<undefined>.

// Login handler
const loginHandler: RequestHandler = async (req: Request<{}, {}, LoginRequestBody>, res: Response): Promise<void> => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            res.status(400).json({ error: 'Missing email or password' });
            return;
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.passwordHash) {
            res.status(401).json({ error: 'Invalid email or password' });
            return;
        }

        const isValidPassword = await bcrypt.compare(password, user.passwordHash);
        if (!isValidPassword) {
            res.status(401).json({ error: 'Invalid email or password' });
            return;
        }

        res.json({
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                username: user.username,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Register handler
const registerHandler: RequestHandler = async (req: Request<{}, {}, LoginRequestBody>, res: Response): Promise<void> => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            res.status(400).json({ error: 'Missing email or password' });
            return;
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            res.status(400).json({ error: 'User already exists' });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const username = email.split('@')[0]; // Generate username from email
        const newUser = await prisma.user.create({
            data: {
                username,
                name: 'New User',
                email,
                passwordHash: hashedPassword,
            },
        });

        res.json({
            user: {
                id: newUser.id,
                email: newUser.email,
                name: newUser.name,
                username: newUser.username,
            },
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// OAuth handler
const oauthHandler: RequestHandler = async (req: Request<{}, {}, OAuthRequestBody>, res: Response): Promise<void> => {
    const { email: providedEmail, name, provider, providerAccountId, username: providedUsername } = req.body;
    console.log('OAuth request payload:', req.body); // Log incoming data
    try {
        if (!provider || !providerAccountId) {
            console.error('Missing required fields:', { provider, providerAccountId });
            res.status(400).json({ error: 'Missing provider or providerAccountId' });
            return;
        }

        // Generate placeholder email for GitHub if email is missing
        const email = providedEmail || (provider === 'github' && providedUsername ? `${providedUsername}@github.oauth` : null);
        if (!email) {
            console.error('No valid email provided:', { providedEmail, providedUsername, provider });
            res.status(400).json({ error: 'No valid email provided' });
            return;
        }

        // Check if user exists by providerAccountId first, then email
        let user = await prisma.user.findFirst({
            where: {
                oauthProvider: provider,
                providerAccountId,
            },
        });

        if (!user && email) {
            // Fallback to email if no match by providerAccountId
            user = await prisma.user.findFirst({
                where: { email },
            });
        }

        console.log('User lookup result:', user ? { id: user.id, email: user.email, username: user.username } : 'No user found');

        if (user) {
            // Update existing user, preserve existing username
            user = await prisma.user.update({
                where: { id: user.id },
                data: {
                    email,
                    name: name || user.name,
                    oauthProvider: provider,
                    providerAccountId,
                },
            });
            console.log('Updated user:', { id: user.id, email: user.email, username: user.username });
        } else {
            // Generate unique username for new user
            let username = providedUsername || email.split('@')[0];
            let suffix = 1;
            while (await prisma.user.findUnique({ where: { username } })) {
                username = `${providedUsername || email.split('@')[0]}${suffix}`;
                suffix++;
            }
            console.log('Generated username for new user:', username);

            // Create new user
            user = await prisma.user.create({
                data: {
                    username,
                    name: name || 'OAuth User',
                    email,
                    oauthProvider: provider,
                    providerAccountId,
                },
            });
            console.log('Created new user:', { id: user.id, email: user.email, username: user.username });
        }

        res.json({
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                username: user.username,
            },
        });
    } catch (error) {
        console.error('OAuth error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

router.post('/login', loginHandler);
router.post('/register', registerHandler);
router.post('/oauth', oauthHandler);

export default router;