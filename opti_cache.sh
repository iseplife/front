YARN_LOCK_SHA256_HASH=$( sha256sum yarn.lock | awk '{ print $1 }')
echo "Current sha256 hash is $YARN_LOCK_SHA256_HASH"
echo "Checking sha256 hash of yarn.lock"

if ! sha256sum -c yarn.lock.sha256sum; then
echo "yarn.lock checksum does not match cache"
sha256sum yarn.lock > yarn.lock.sha256sum
else
echo "Cache is the same as before, removing cache files to prevent cache from updating"
rm -rf node_modules
rm -rf .yarn
rm -rf yarn.lock.sha256sum
fi
