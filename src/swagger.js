const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'NesaVerse API',
      version: '1.0.0',
      description: 'API Documentation for NesaVerse Community Platform — manages communities, servers, channels, social media accounts, donations, and analytics.',
      contact: {
        name: 'NesaVerse Team',
      },
    },
    servers: [
      {
        url: 'https://be-nesaverse.vercel.app',
        description: 'Production (Vercel)',
      },
      {
        url: 'http://localhost:5001',
        description: 'Development server',
      },
    ],
    tags: [
      { name: 'Health',       description: 'Health check' },
      { name: 'Stats',        description: 'Platform statistics & analytics' },
      { name: 'Communities',  description: 'Community management' },
      { name: 'Servers',      description: 'Discord server management' },
      { name: 'Channels',     description: 'WhatsApp channel management' },
      { name: 'Instagram',    description: 'Instagram account management' },
      { name: 'TikTok',       description: 'TikTok account management' },
      { name: 'YouTube',      description: 'YouTube channel management' },
      { name: 'Roblox',       description: 'Roblox game management' },
      { name: 'Donations',    description: 'Donation management' },
    ],
    paths: {
      '/api/health': {
        get: {
          summary: 'Health check',
          tags: ['Health'],
          responses: {
            200: {
              description: 'Server is healthy',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Health' },
                },
              },
            },
          },
        },
      },
    },
    components: {
      schemas: {
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Internal Server Error' },
          },
        },
        Health: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'ok' },
            time:   { type: 'string', format: 'date-time' },
          },
        },
        Stats: {
          type: 'object',
          properties: {
            communities:          { type: 'integer', example: 500 },
            members:              { type: 'integer', example: 50000 },
            accounts:             { type: 'integer', example: 2000 },
            servers:              { type: 'integer', example: 100 },
            totalVisitors:        { type: 'integer', example: 4892103 },
            activeCommunities:    { type: 'integer', example: 12 },
            nesaVelocity:         { type: 'integer', example: 842 },
            viralIndex:           { type: 'string', example: '9.2' },
            systemStatus:         { type: 'string', example: 'online' },
            totalPlatforms:       { type: 'integer', example: 6 },
            platformDistribution: {
              type: 'object',
              properties: {
                discord:   { type: 'integer' },
                whatsapp:  { type: 'integer' },
                instagram: { type: 'integer' },
                tiktok:    { type: 'integer' },
                youtube:   { type: 'integer' },
                roblox:    { type: 'integer' },
              },
            },
            timestamp: { type: 'string', format: 'date-time' },
          },
        },
        ChartData: {
          type: 'object',
          properties: {
            platformData: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name:  { type: 'string', example: 'Discord' },
                  value: { type: 'integer' },
                  color: { type: 'string', example: '#5865F2' },
                },
              },
            },
            visitorTrend: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  day:    { type: 'string', example: 'Mon' },
                  visits: { type: 'integer' },
                },
              },
            },
            donationTrend: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  month: { type: 'string', example: 'Jan' },
                  total: { type: 'integer' },
                },
              },
            },
          },
        },
        Community: {
          type: 'object',
          properties: {
            id:          { type: 'integer', example: 1 },
            name:        { type: 'string', example: 'Nesa_Nexus' },
            initial:     { type: 'string', example: 'N' },
            color:       { type: 'string', example: 'primary' },
            members:     { type: 'string', example: '2.4M' },
            growth:      { type: 'string', example: '+8.2%' },
            safetyScore: { type: 'integer', example: 92 },
            status:      { type: 'string', example: 'active' },
          },
        },
        Server: {
          type: 'object',
          properties: {
            id:          { type: 'integer', example: 1 },
            name:        { type: 'string', example: 'Pixel Raiders Elite' },
            description: { type: 'string', example: 'The premier hub for indie game discovery.' },
            members:     { type: 'integer', example: 45829 },
            online:      { type: 'integer', example: 1200 },
            verified:    { type: 'boolean', example: true },
            featured:    { type: 'boolean', example: false },
            banner:      { type: 'string', nullable: true },
            icon:        { type: 'string', nullable: true },
            categories:  { type: 'array', items: { type: 'string' }, example: ['Gaming', 'Events'] },
          },
        },
        ServerCreate: {
          type: 'object',
          required: ['name'],
          properties: {
            name:        { type: 'string', example: 'New Server' },
            description: { type: 'string' },
            icon:        { type: 'string' },
            banner:      { type: 'string' },
            members:     { type: 'integer', example: 0 },
            online:      { type: 'integer', example: 0 },
            link:        { type: 'string' },
            verified:    { type: 'boolean', example: false },
            featured:    { type: 'boolean', example: false },
            status:      { type: 'string', example: 'active' },
          },
        },
        Channel: {
          type: 'object',
          properties: {
            id:          { type: 'integer', example: 1 },
            name:        { type: 'string', example: 'Pixel Overlords' },
            category:    { type: 'string', example: 'Gaming' },
            followers:   { type: 'integer', example: 142000 },
            description: { type: 'string' },
            avatar:      { type: 'string', nullable: true },
          },
        },
        ChannelCreate: {
          type: 'object',
          required: ['name'],
          properties: {
            name:        { type: 'string', example: 'New Channel' },
            description: { type: 'string' },
            avatar:      { type: 'string' },
            category:    { type: 'string', example: 'Tech' },
            followers:   { type: 'integer', example: 0 },
            link:        { type: 'string' },
            status:      { type: 'string', example: 'active' },
          },
        },
        InstagramAccount: {
          type: 'object',
          properties: {
            id:        { type: 'integer', example: 1 },
            name:      { type: 'string', example: 'NesaVerse' },
            handle:    { type: 'string', example: '@nesaverse' },
            avatar:    { type: 'string', nullable: true },
            followers: { type: 'string', example: '125K' },
            posts:     { type: 'integer', example: 342 },
            category:  { type: 'string', example: 'Lifestyle' },
            bio:       { type: 'string', nullable: true },
            verified:  { type: 'boolean', example: false },
            link:      { type: 'string', nullable: true },
            gradient:  { type: 'string', nullable: true },
            status:    { type: 'string', example: 'active' },
          },
        },
        InstagramCreate: {
          type: 'object',
          required: ['name', 'handle', 'category'],
          properties: {
            name:      { type: 'string', example: 'NesaVerse' },
            handle:    { type: 'string', example: '@nesaverse' },
            avatar:    { type: 'string' },
            followers: { type: 'string', example: '125K' },
            posts:     { type: 'integer', example: 342 },
            category:  { type: 'string', example: 'Lifestyle' },
            bio:       { type: 'string' },
            verified:  { type: 'boolean', example: false },
            link:      { type: 'string' },
            gradient:  { type: 'string' },
          },
        },
        TikTokAccount: {
          type: 'object',
          properties: {
            id:       { type: 'integer', example: 1 },
            creator:  { type: 'string', example: '@nesacreator' },
            title:    { type: 'string', example: 'NesaVerse Highlights' },
            views:    { type: 'string', example: '1.2M' },
            likes:    { type: 'string', example: '89K' },
            category: { type: 'string', example: 'Entertainment' },
            thumb:    { type: 'string', nullable: true },
            avatar:   { type: 'string', nullable: true },
            trending: { type: 'boolean', example: false },
            duration: { type: 'string', nullable: true },
            link:     { type: 'string', nullable: true },
            status:   { type: 'string', example: 'active' },
          },
        },
        TikTokCreate: {
          type: 'object',
          required: ['creator', 'title', 'category'],
          properties: {
            creator:  { type: 'string', example: '@nesacreator' },
            title:    { type: 'string', example: 'NesaVerse Highlights' },
            views:    { type: 'string', example: '1.2M' },
            likes:    { type: 'string', example: '89K' },
            category: { type: 'string', example: 'Entertainment' },
            thumb:    { type: 'string' },
            avatar:   { type: 'string' },
            trending: { type: 'boolean', example: false },
            duration: { type: 'string', example: '0:30' },
            link:     { type: 'string' },
          },
        },
        YouTubeChannel: {
          type: 'object',
          properties: {
            id:          { type: 'integer', example: 1 },
            name:        { type: 'string', example: 'NesaVerse Official' },
            thumbnail:   { type: 'string', nullable: true },
            subscribers: { type: 'string', example: '500K' },
            description: { type: 'string', nullable: true },
            link:        { type: 'string' },
            category:    { type: 'string', example: 'Tech' },
            status:      { type: 'string', example: 'active' },
          },
        },
        YouTubeCreate: {
          type: 'object',
          required: ['name', 'link', 'category'],
          properties: {
            name:        { type: 'string', example: 'NesaVerse Official' },
            thumbnail:   { type: 'string' },
            subscribers: { type: 'string', example: '500K' },
            description: { type: 'string' },
            link:        { type: 'string', example: 'https://youtube.com/@nesaverse' },
            category:    { type: 'string', example: 'Tech' },
          },
        },
        RobloxGame: {
          type: 'object',
          properties: {
            id:             { type: 'integer', example: 1 },
            name:           { type: 'string', example: 'Nesa Legends' },
            thumbnail:      { type: 'string', nullable: true },
            description:    { type: 'string', nullable: true },
            link_game:      { type: 'string' },
            link_community: { type: 'string', nullable: true },
            status:         { type: 'string', example: 'active' },
          },
        },
        RobloxCreate: {
          type: 'object',
          required: ['name', 'link_game'],
          properties: {
            name:           { type: 'string', example: 'Nesa Legends' },
            thumbnail:      { type: 'string' },
            description:    { type: 'string' },
            link_game:      { type: 'string', example: 'https://roblox.com/games/123' },
            link_community: { type: 'string' },
          },
        },
        Donation: {
          type: 'object',
          properties: {
            id:           { type: 'integer', example: 1 },
            name:         { type: 'string', example: 'Anonymous' },
            is_anonymous: { type: 'boolean', example: false },
            amount:       { type: 'number', example: 50000 },
            message:      { type: 'string', nullable: true },
            created_at:   { type: 'string', format: 'date-time' },
          },
        },
        DonationCreate: {
          type: 'object',
          required: ['amount'],
          properties: {
            name:         { type: 'string', example: 'John' },
            is_anonymous: { type: 'boolean', example: false },
            amount:       { type: 'number', example: 50000 },
            message:      { type: 'string', example: 'Keep building!' },
          },
        },
        TopDonor: {
          type: 'object',
          properties: {
            name:  { type: 'string', example: 'John' },
            total: { type: 'number', example: 250000 },
            count: { type: 'integer', example: 5 },
          },
        },
        SuccessMessage: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Server deleted' },
          },
        },
        SuccessBool: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
