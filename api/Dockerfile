FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /app

# Copy everything to the working directory
COPY . .

# Display the directory structure
RUN ls -la
RUN find . -name "*.sln" -type f
RUN find . -name "*.csproj" -type f

# Create an enhanced build script that handles everything
RUN echo '#!/bin/bash' > build.sh && \
    echo 'set -ex' >> build.sh && \
    echo '' >> build.sh && \
    echo '# Create new uppercase directories' >> build.sh && \
    echo 'mkdir -p TravelMemories' >> build.sh && \
    echo 'mkdir -p TravelMemories/TravelMemories' >> build.sh && \
    echo 'mkdir -p TravelMemories/TravelMemories.Core' >> build.sh && \
    echo 'mkdir -p TravelMemories/TravelMemories.Data' >> build.sh && \
    echo 'mkdir -p TravelMemories/TravelMemories.Service' >> build.sh && \
    echo '' >> build.sh && \
    echo '# Copy solution file and fix paths' >> build.sh && \
    echo 'cp travelMemories/travelMemories.sln TravelMemories/TravelMemories.sln' >> build.sh && \
    echo 'sed -i "s/travelMemories.csproj/TravelMemories.csproj/g" TravelMemories/TravelMemories.sln' >> build.sh && \
    echo 'sed -i "s/travelMemories.Core.csproj/TravelMemories.Core.csproj/g" TravelMemories/TravelMemories.sln' >> build.sh && \
    echo 'sed -i "s/travelMemories.Data.csproj/TravelMemories.Data.csproj/g" TravelMemories/TravelMemories.sln' >> build.sh && \
    echo 'sed -i "s/travelMemories.Service.csproj/TravelMemories.Service.csproj/g" TravelMemories/TravelMemories.sln' >> build.sh && \
    echo '' >> build.sh && \
    echo '# Copy and rename project files' >> build.sh && \
    echo 'cp -r travelMemories/travelMemories/* TravelMemories/TravelMemories/' >> build.sh && \
    echo 'cp travelMemories/travelMemories/travelMemories.csproj TravelMemories/TravelMemories/TravelMemories.csproj' >> build.sh && \
    echo '' >> build.sh && \
    echo 'cp -r travelMemories/travelMemories.Core/* TravelMemories/TravelMemories.Core/' >> build.sh && \
    echo 'cp travelMemories/travelMemories.Core/travelMemories.Core.csproj TravelMemories/TravelMemories.Core/TravelMemories.Core.csproj' >> build.sh && \
    echo '' >> build.sh && \
    echo 'cp -r travelMemories/travelMemories.Data/* TravelMemories/TravelMemories.Data/' >> build.sh && \
    echo 'cp travelMemories/travelMemories.Data/travelMemories.Data.csproj TravelMemories/TravelMemories.Data/TravelMemories.Data.csproj' >> build.sh && \
    echo '' >> build.sh && \
    echo 'cp -r travelMemories/travelMemories.Service/* TravelMemories/TravelMemories.Service/' >> build.sh && \
    echo 'cp travelMemories/travelMemories.Service/travelMemories.Service.csproj TravelMemories/TravelMemories.Service/TravelMemories.Service.csproj' >> build.sh && \
    echo '' >> build.sh && \
    echo '# Fix project references in csproj files' >> build.sh && \
    echo 'find TravelMemories -name "*.csproj" -type f -exec sed -i "s/travelMemories.Core/TravelMemories.Core/g" {} \\;' >> build.sh && \
    echo 'find TravelMemories -name "*.csproj" -type f -exec sed -i "s/travelMemories.Data/TravelMemories.Data/g" {} \\;' >> build.sh && \
    echo 'find TravelMemories -name "*.csproj" -type f -exec sed -i "s/travelMemories.Service/TravelMemories.Service/g" {} \\;' >> build.sh && \
    echo 'find TravelMemories -name "*.csproj" -type f -exec sed -i "s/travelMemories.csproj/TravelMemories.csproj/g" {} \\;' >> build.sh && \
    echo '' >> build.sh && \
    echo '# Verify structure' >> build.sh && \
    echo 'find TravelMemories -type f -name "*.csproj" | sort' >> build.sh && \
    echo 'find TravelMemories -type f -name "*.sln" | sort' >> build.sh && \
    echo '' >> build.sh && \
    echo '# Build the project' >> build.sh && \
    echo 'cd TravelMemories' >> build.sh && \
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