FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /app

# Copy everything to the working directory
COPY . .

# Show directory structure to debug the issue
RUN pwd
RUN ls -la
RUN find . -type d | sort
RUN find . -name "*.sln" -type f
RUN find . -name "*.csproj" -type f

# Create a script to build the project with dynamic path discovery
RUN echo '#!/bin/bash' > build.sh && \
    echo 'set -x' >> build.sh && \
    echo 'find . -name "*.sln" -type f' >> build.sh && \
    echo 'find . -name "*.csproj" -type f' >> build.sh && \
    echo 'SOLUTION_PATH=$(find . -name "*.sln" -type f | head -n 1)' >> build.sh && \
    echo 'if [ -z "$SOLUTION_PATH" ]; then' >> build.sh && \
    echo '  echo "ERROR: Could not find any solution (.sln) file"' >> build.sh && \
    echo '  exit 1' >> build.sh && \
    echo 'fi' >> build.sh && \
    echo 'echo "Found solution at: $SOLUTION_PATH"' >> build.sh && \
    echo 'dotnet restore "$SOLUTION_PATH"' >> build.sh && \
    echo 'PROJECT_PATHS=$(find . -name "*.csproj" -type f)' >> build.sh && \
    echo 'MAIN_PROJECT=""' >> build.sh && \
    echo 'for PROJECT in $PROJECT_PATHS; do' >> build.sh && \
    echo '  if [[ "$PROJECT" == *"/travelMemories/travelMemories.csproj" ]] || [[ "$PROJECT" == *"/TravelMemories/TravelMemories.csproj" ]]; then' >> build.sh && \
    echo '    MAIN_PROJECT="$PROJECT"' >> build.sh && \
    echo '    break' >> build.sh && \
    echo '  fi' >> build.sh && \
    echo 'done' >> build.sh && \
    echo 'if [ -z "$MAIN_PROJECT" ]; then' >> build.sh && \
    echo '  echo "ERROR: Could not find main project file"' >> build.sh && \
    echo '  exit 1' >> build.sh && \
    echo 'fi' >> build.sh && \
    echo 'echo "Found main project at: $MAIN_PROJECT"' >> build.sh && \
    echo 'dotnet publish "$MAIN_PROJECT" -c Release -o /app/out' >> build.sh && \
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