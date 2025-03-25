FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /app

# Copy everything to the working directory
COPY . .

# Find and list all solution files for debugging
RUN find . -name "*.sln" -type f

# Find and list all project files for debugging
RUN find . -name "*.csproj" -type f

# Restore and publish the application (adjust paths as needed)
RUN dotnet restore
RUN dotnet publish -c Release -o /app/out

# Build the runtime image
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=build /app/out ./

# Configure the environment
ENV ASPNETCORE_URLS=http://+:8080

EXPOSE 8080
ENTRYPOINT ["dotnet", "TravelMemories.dll"]