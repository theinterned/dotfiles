echo
echo
echo "##################################################"
echo "####### Install ###########################"
echo "##################################################"
echo
echo

SCRIPTPATH="$( cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"
[ $(uname -s) = "Darwin" ] && export MACOS=1 && export UNIX=1
[ $(uname -s) = "Linux" ] && export LINUX=1 && export UNIX=1

echo "MACOS: $MACOS"
echo "LINUX: $LINUX"

if [ $MACOS ]
then
  $SCRIPTPATH/install-mac.sh
elif [ $LINUX ]
then
  $SCRIPTPATH/install-linux.sh
fi