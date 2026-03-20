# Stage 1: Build React
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Build .NET
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS backend-build
WORKDIR /app/backend
COPY backend/PatrickStar.API/PatrickStar.API.csproj ./
RUN dotnet restore
COPY backend/PatrickStar.API/ ./
COPY --from=frontend-build /app/frontend/dist ./wwwroot
RUN dotnet publish -c Release -o /publish

# Stage 3: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=backend-build /publish ./
RUN mkdir -p /data /data/photos
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production
ENV Database__Path=/data/patrickstar.db
ENV Jwt__Key=CHANGE_THIS_SECRET_KEY_IN_PRODUCTION_MIN32CHARS
ENTRYPOINT ["dotnet", "PatrickStar.API.dll"]
