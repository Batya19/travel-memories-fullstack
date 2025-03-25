FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /app

# Copy everything to the working directory
COPY . .

# Create a custom build script that handles casing issues
RUN echo '#!/bin/bash' > build.sh && \
    echo 'cd travelMemories' >> build.sh && \
    echo 'cat travelMemories.sln | sed "s/TravelMemories/travelMemories/g" > fixed.sln' >> build.sh && \
    echo 'mv fixed.sln travelMemories.sln' >> build.sh && \
    echo 'dotnet restore' >> build.sh && \
    echo 'dotnet publish travelMemories/travelMemories.csproj -c Release -o /app/out' >> build.sh && \
    chmod +x build.sh

# Run the build script
RUN ./build.sh

# Build the runtime image
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=build /app/out ./

# Configure the environment
ENV ASPNETCORE_URLS=http://+:8080

EXPOSE 8080
ENTRYPOINT ["dotnet", "travelMemories.dll"]