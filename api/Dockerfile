FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /app

# Copy everything to the working directory
COPY . .

# Display the directory structure
RUN ls -la
RUN find . -name "*.sln" -type f
RUN find . -name "*.csproj" -type f

# Create a script that copies all files to uppercase directories
RUN echo '#!/bin/bash' > build.sh && \
    echo 'set -x' >> build.sh && \
    echo 'mkdir -p TravelMemories' >> build.sh && \
    echo 'cp -r travelMemories/* TravelMemories/' >> build.sh && \
    echo 'mkdir -p TravelMemories/TravelMemories' >> build.sh && \
    echo 'cp -r travelMemories/travelMemories/* TravelMemories/TravelMemories/' >> build.sh && \
    echo 'mkdir -p TravelMemories/TravelMemories.Core' >> build.sh && \
    echo 'cp -r travelMemories/travelMemories.Core/* TravelMemories/TravelMemories.Core/' >> build.sh && \
    echo 'mkdir -p TravelMemories/TravelMemories.Data' >> build.sh && \
    echo 'cp -r travelMemories/travelMemories.Data/* TravelMemories/TravelMemories.Data/' >> build.sh && \
    echo 'mkdir -p TravelMemories/TravelMemories.Service' >> build.sh && \
    echo 'cp -r travelMemories/travelMemories.Service/* TravelMemories/TravelMemories.Service/' >> build.sh && \
    echo 'cd TravelMemories' >> build.sh && \
    echo 'ls -la' >> build.sh && \
    echo 'dotnet restore' >> build.sh && \
    echo 'dotnet publish TravelMemories/TravelMemories.csproj -c Release -o /app/out' >> build.sh && \
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
ENTRYPOINT ["dotnet", "TravelMemories.dll"]