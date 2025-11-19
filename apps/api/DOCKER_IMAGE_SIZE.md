# Docker Image Size Optimization

## How Docker Multi-Stage Builds Work

### Key Concepts

1. **Only the final stage counts**: Docker multi-stage builds mean that intermediate stages are discarded. Only what's in your final stage (`production` in this case) contributes to the final image size.

2. **COPY --from creates new layers**: When you `COPY --from=build /repo/packages/`, you're creating a new layer that contains those files. If you then delete them with `RUN rm`, you're creating another layer, but the COPY layer still exists (though Docker may optimize it).

3. **Layer deduplication**: Docker does deduplicate identical layers, so if you COPY everything then delete it in the same RUN command, Docker may optimize it, but it's not guaranteed.

## Current Approach vs Optimized Approach

### Current Approach (Inefficient)
```dockerfile
# Copies ALL packages into a layer
COPY --from=build /repo/packages/ /tmp/packages/
# Filters and copies only needed ones
RUN script-to-filter-packages
# Deletes temp, but COPY layer still contains all packages
RUN rm -rf /tmp/packages
```

**Problem**: The COPY layer still contains all packages, even if you delete them later.

### Optimized Approach (What We're Doing Now)
```dockerfile
# Generate dependency list in build stage
RUN generate-dependency-list > /tmp/api-dependencies.json

# In production stage:
# Copy dependency list
COPY --from=build /tmp/api-dependencies.json /tmp/deps.json
# Copy all packages (needed to filter)
COPY --from=build /repo/packages/ /tmp/all-packages/
# Filter and copy only needed packages, delete temp in SAME layer
RUN filter-packages && rm -rf /tmp/all-packages
```

**Better**: Deleting in the same RUN command as the filtering minimizes the impact.

### Ideal Approach (Not Possible with Docker)
```dockerfile
# Copy only specific packages based on dependency list
COPY --from=build /repo/packages/contracts/ ./packages/contracts/
COPY --from=build /repo/packages/utils/ ./packages/utils/
```

**Why not**: Docker doesn't support dynamic wildcards or COPY based on runtime data.

## Best Practice Solution

Since Docker doesn't support dynamic COPY paths, we use:

1. **Build stage**: Has everything (needed for building)
2. **Production stage**: 
   - Copy dependency list
   - Copy all packages temporarily
   - Filter and copy only needed ones
   - Delete temp in the same RUN command

This minimizes the layer that contains all packages.

## Image Size Impact

- **Build stage size**: ~2GB (with all source code)
- **Production stage size**: ~500MB (only dist, node_modules, needed packages)
- **Final image size**: Only production stage matters!

The key is: having everything in the build stage does NOT affect final image size. Only what you COPY to the production stage matters.

## Recommendation

The current optimized approach is good enough. The small inefficiency of temporarily copying all packages is acceptable because:
1. Docker may deduplicate layers
2. The COPY layer is small compared to node_modules
3. The final image only contains what we need

If you want maximum optimization, you could:
1. Generate the dependency list in CI/CD before Docker build
2. Use a build script that generates COPY commands for only needed packages
3. This is more complex but minimizes image size

