FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Source will be bind-mounted for live reload, but keep a copy so the image can still start
# even if you run it without volumes.
COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]

