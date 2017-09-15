import fabric.api as fab
from fabric.decorators import roles


fab.env.roledefs = {
    'web': ['stevearc@stevearc.com'],
}


@roles('web')
def deploy():
    # Get the sudo password immediately
    fab.sudo('true')
    fab.local("rm dist/*")
    fab.local("npm run build-prod")
    fab.put("dist/*", "/usr/share/nginx/dice/", use_sudo=True)
