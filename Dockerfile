# Rust 1.57.0 base
FROM rust:1.57

RUN rustc --version

# Install Solana 1.8.16
RUN sh -c "$(curl -sSfL https://release.solana.com/v1.8.16/install)"
ENV PATH="/root/.local/share/solana/install/releases/1.8.16/solana-release/bin:${PATH}"

RUN solana --version

RUN apt update
RUN apt install -y nodejs npm

RUN node --version
RUN npm --version

WORKDIR /app

RUN npm i -g rimraf

COPY package.json yarn.lock ./
RUN yarn

COPY . ./
RUN yarn build

EXPOSE 8080
CMD [  "node", "dist/main.js" ]
