FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /app

# Copy everything to the working directory
COPY . .

# Show directory structure for debugging
RUN ls -la
RUN find . -name "*.sln" -type f
RUN find . -name "*.csproj" -type f

# Check the content of the solution file
RUN cat $(find . -name "*.sln" -type f)

# Display the structure of travelMemories directory
RUN ls -la ./travelMemories

# Build the runtime image
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=build /app/out ./

# Configure the environment
ENV ASPNETCORE_URLS=http://+:8080

EXPOSE 8080
ENTRYPOINT ["dotnet", "TravelMemories.dll"]