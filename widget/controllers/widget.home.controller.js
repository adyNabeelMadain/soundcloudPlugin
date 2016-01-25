'use strict';

(function (angular) {
    angular
        .module('soundCloudPluginWidget')
        .controller('WidgetHomeCtrl', ['$scope', '$timeout', 'DEFAULT_DATA', 'COLLECTIONS', 'DB', 'soundCloudAPI','Buildfire',
            '$rootScope',
            function ($scope, $timeout, DEFAULT_DATA, COLLECTIONS, DB, soundCloudAPI,Buildfire, $rootScope) {
                console.log('WidgetHomeCtrl Controller Loaded-------------------------------------');
                $rootScope.playTrack=false;
                var WidgetHome = this, view = null;

                WidgetHome.page = -1;
                WidgetHome.noMore = false;

                /*declare the device width heights*/
                $rootScope.deviceHeight = window.innerHeight;
                $rootScope.deviceWidth = window.innerWidth;

                WidgetHome.SoundCloudInfoContent = new DB(COLLECTIONS.SoundCloudInfo);


                WidgetHome.showDescription = function () {
                    if (WidgetHome.info.data.content.description == '<p>&nbsp;<br></p>' || WidgetHome.info.data.content.description == '<p><br data-mce-bogus="1"></p>')
                        return false;
                    else
                        return true;
                };

                /// load items
                function loadItems(carouselItems) {
                    // create an instance and pass it the items if you don't have items yet just pass []
                    if (view)
                        view.loadItems(carouselItems);
                }

                var initCarousel = function () {

                    if (WidgetHome.info && WidgetHome.info.data.content.images.length) {
                        loadItems(WidgetHome.info.data.content.images);
                    } else {
                        loadItems([]);
                    }

                };

                WidgetHome.SoundCloudInfoContent.get().then(function success(result) {
                        console.log('result>>>', result);
                        //result && result.data && result.id
                        if (true) {
                            result = DEFAULT_DATA.SOUND_CLOUD_INFO;
                            WidgetHome.info = result;
                            $rootScope.bgImage = WidgetHome.info.data.design.bgImage;
                            if (WidgetHome.info.data.content.link && WidgetHome.info.data.content.soundcloudClientID) {
                                /*    soundCloudAPI.getTracks(WidgetHome.info.data.content.link, WidgetHome.info.data.content.soundcloudClientID)
                                 .then(function (data) {
                                 WidgetHome.tracks = data;
                                 }, function () {

                                 });*/
                                soundCloudAPI.connect(WidgetHome.info.data.content.soundcloudClientID);
                                WidgetHome.loadMore();

                            }
                        }
                        else {
                            WidgetHome.info = DEFAULT_DATA.SOUND_CLOUD_INFO;
                        }
                    },
                    function fail() {
                        WidgetHome.info = DEFAULT_DATA.SOUND_CLOUD_INFO;
                    }
                );

                WidgetHome.goToTrack = function (track) {
                    console.log('Goto Track called---------------------------------------',track);
                    $rootScope.playTrack=true;
                    WidgetHome.currentTrack=track;
                    console.log('Goto Track called---------------$rootScope playTrack------------------------',$rootScope.playTrack);
                    if (!$rootScope.$$phase)$rootScope.$digest();
                };

                WidgetHome.loadMore = function () {
                    soundCloudAPI.getTracks(WidgetHome.info.data.content.link, ++WidgetHome.page)
                        .then(function (data) {
                            var d = data.collection;
                            WidgetHome.tracks = WidgetHome.tracks ? WidgetHome.tracks.concat(d) : d;
                            console.log('WidgetHome.tracks', WidgetHome.tracks);
                            $scope.$digest();
                        });
                };

                /**
                 * audioPlayer is Buildfire.services.media.audioPlayer.
                 */
                var audioPlayer = Buildfire.services.media.audioPlayer;

                /**
                 * Player related method and variables
                 */

                WidgetHome.playTrack=function(){
                    console.log('Widget HOme url----------------------',WidgetHome.currentTrack.stream_url+'?clientId='+WidgetHome.info.data.content.soundcloudClientID);
                    WidgetHome.playing=true;
                        audioPlayer.play({url:WidgetHome.currentTrack.stream_url+'?clientId='+WidgetHome.info.data.content.soundcloudClientID});
                };
                WidgetHome.pauseTrack=function(){
                    WidgetHome.playing=false;
                };
                WidgetHome.openSettingsOverlay=function(){
                    WidgetHome.openSettings=true;
                };
                WidgetHome.openPlayListOverlay=function(){
                    WidgetHome.openPlaylist=true;
                };
                WidgetHome.openMoreInfoOverlay=function(){
                    WidgetHome.openMoreInfo=true;
                };
                WidgetHome.closeSettingsOverlay=function(){
                    WidgetHome.openSettings=false;
                };
                WidgetHome.closePlayListOverlay=function(){
                    WidgetHome.openPlaylist=false;
                };
                WidgetHome.closeMoreInfoOverlay=function(){
                    WidgetHome.openMoreInfo=false;
                };
                $scope.$on("Carousel:LOADED", function () {
                    if (!view) {
                        view = new window.buildfire.components.carousel.view("#carousel", []);  ///create new instance of buildfire carousel viewer
                    }
                    if (view && WidgetHome.info && WidgetHome.info.data) {
                        initCarousel();
                    }
                    else {
                        view.loadItems([]);
                    }
                });


            }]);
})(window.angular);