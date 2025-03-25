FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /app

# Copy everything to the working directory
COPY . .

# Restore and publish the application with the correct case-sensitive paths
RUN dotnet restore ./travelMemories/travelMemories.sln
RUN dotnet publish ./travelMemories/travelMemories/travelMemories.csproj -c Release -o /app/out

# Build the runtime image
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=build /app/out ./

# Configure the environment
ENV ASPNETCORE_URLS=http://+:8080

EXPOSE 8080
ENTRYPOINT ["dotnet", "TravelMemories.dll"]