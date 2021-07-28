# Use the official lightweight Node.js 14 image.
# https://hub.docker.com/_/node
FROM node:alpine AS deps

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure copying both package.json AND package-lock.json (when available).
# Copying this first prevents re-running npm install on every code change.
COPY package*.json ./

# Rebuild the source code only when needed
FROM node:alpine AS builder
WORKDIR /
COPY . .
RUN npm ci --only=production --ignore-scripts --prefer-offline && npm run build

# Production image, copy all the files and run next
FROM node:alpine AS runner
WORKDIR /

ENV NODE_ENV production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# You only need to copy next.config.js if you are NOT using the default configuration
# COPY --from=builder /app/next.config.js ./
COPY --from=builder ./public ./public
COPY --from=builder --chown=nextjs:nodejs ./.next ./.next
COPY --from=builder ./node_modules ./node_modules
COPY --from=builder ./package.json ./package.json

USER nextjs

EXPOSE 3000

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry.
ENV NEXT_TELEMETRY_DISABLED 1

# Run the web service on container startup.
CMD [ "npm", "start" ]
