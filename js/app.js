$(document).ready(function () {
    document.addEventListener("deviceready",onDeviceReady(),false);
});
function onDeviceReady(){

    if(localStorage.channel==null || localStorage.channel==''){
        $("#popupDialog").popup("open");
    }else {
        var channel = localStorage.getItem('channel');
    }
    getPlayList(channel);
    $(document).on('click','#videoList li',function () {
        showVideo($(this).attr('videoId'));
    });
    $('#channelBtnOk').click(function () {
        var channel= $('#channelName').val();
        setChannel(channel);
        getPlayList(channel);

    });
    $('#saveOPtions').click(function () {
        saveOptions();
    });
    $('#clearChannel').click(function () {
        clearChannel();
    });
    $(document).on('pageinit','#options',function (e) {
        var channel =localStorage.getItem('channel');
        var maxResults =localStorage.getItem('maxResults');
        $('#channelNameOptions').attr('value',channel);
        $('#maxResutlsOptions').attr('value',maxResults);
    });

}
function getPlayList(channel) {
    $('#videoList').html();
    $.get("https://www.googleapis.com/youtube/v3/channels",
        {
            part:'contentDetails',
            forUsername:channel,
            key:'AIzaSyB9x2qmSnqNWSZPj6qFYOWN69XAmWbgV2Q'
        },
        function (data) {
            $.each(data.items,function (i,item) {
                playListId = item.contentDetails.relatedPlaylists.uploads;
                getVideos(playListId,localStorage.getItem('maxResults'));
            })
        }
    )
}
function getVideos(playlistId,maxResults) {
    $.get("https://www.googleapis.com/youtube/v3/playlistItems",
        {
            part:'snippet,contentDetails',
            maxResults:maxResults,
            playlistId:playlistId,
            key:'AIzaSyB9x2qmSnqNWSZPj6qFYOWN69XAmWbgV2Q'
        },function (data) {
            var output;
            $.each(data.items ,function (i,item) {
                id= item.snippet.resourceId.videoId;
                title= item.snippet.title;
                thumb= item.snippet.thumbnails.default.url;
                $("#videoList").append('<li videoId="'+id+'"><img src="'+thumb+'"><h3>'+title+'</h3></li>');
                $('#videoList').listview().listview('refresh');

            })
        }
    )
}
function showVideo(id) {
    $('#logo').hide();
    var output='<iframe width="100%" height="250" src="https://www.youtube.com/embed/'+id+'" frameborder="0" allowfullscreen></iframe>';
    $('#showVedio').html(output);
}
function setChannel(channel) {
    localStorage.setItem('channel',channel);
}
function saveOptions() {
    var channel = $("#channelNameOptions").val();
    setChannel(channel );
    var  maxResults = $('#maxResutlsOptions').val();
    setMaxResults(maxResults);
    $('body').pagecontainer('change','#main',{options});
    getPlayList(channel);
}
function setMaxResults (maxResults){
    localStorage.setItem('maxResults',maxResults);
}
function clearChannel (maxResults){
    localStorage.removeItem('cahnnel');
    $('body').pagecontainer('change','#main',{options});
    $('#videoList').html('');
    $('#popupDialog').popup('open');
}
