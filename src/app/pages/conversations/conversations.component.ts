import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-conversations',
  templateUrl: './conversations.component.html',
  styleUrls: ['./conversations.component.scss']
})
export class ConversationComponent implements OnInit {
  public dtsConversationa: any = [{
    "Id": 73,
    "Hotel_Name": "Hamburg Suites",
    "Address": "An Der Alster 82",
    "Postal_Code": "20099",
    "Description": "Only a few hundred meters from the city center, enjoy the energy of Hamburg each and every night of your stay in our hotel. We are currently renovating some of our guest rooms so that we can serve you better. Welcome to Hamburg and enjoy your stay.",
    "Hotel_Class": "Diamond",
    "City": "Hamburg",
    "Price": 299,
    "Images": [{
      "FileName": "Hamburg-1.jpg"
    }, {
      "FileName": "Lobby-0.jpg"
    }, {
      "FileName": "MeetingRoom-4.jpg",
      "widthRatio": 2,
      "heightRatio": 2
    }, {
      "FileName": "Restaurant-18.jpg",
      "widthRatio": 2,
      "heightRatio": 2
    }, {
      "FileName": "Bedroom-1-2.jpg"
    }, {
      "FileName": "Bathroom-0.jpg"
    }
    ]
  }, {
    "Id": 75,
    "Hotel_Name": "The Stanadard Resort",
    "Address": "Steindamm 99",
    "Postal_Code": "20359",
    "Description": "At the Standard, there is nothing we won't do to make our guests feel at home. Our rooms offer the very best quality furnishings. Our restaurants serve the best foods and our bar has the largest collection of German beers in Europe. See you soon.",
    "Hotel_Class": "Platinum",
    "City": "Hamburg",
    "Price": 399,
    "Images": [{
      "FileName": "Hamburg-5.jpg"
    }, {
      "FileName": "Lobby-14.jpg"
    }, {
      "FileName": "Bathroom-3.jpg",
      "widthRatio": 2,
      "heightRatio": 2
    }, {
      "FileName": "Bedroom-2-0.jpg",
      "widthRatio": 2,
      "heightRatio": 2
    }, {
      "FileName": "MeetingRoom-4.jpg"
    }, {
      "FileName": "Restaurant-15.jpg"
    }
    ]
  }, {
    "Id": 76,
    "Hotel_Name": "The Park Hotel",
    "Address": "Borstelmannsweg 82",
    "Postal_Code": "20537",
    "Description": "The Park remains the go to address for those travelling to the beautiful city of Hamburg. It's where both old and new merge into a single experience. We are currently offering special rates for frequent travellers to our hotel. Call us and book your room.",
    "Hotel_Class": "Gold",
    "City": "Hamburg",
    "Price": 289,
    "Images": [{
      "FileName": "Hamburg-7.jpg"
    }, {
      "FileName": "Lobby-9.jpg"
    }, {
      "FileName": "Bathroom-4.jpg",
      "widthRatio": 2,
      "heightRatio": 2
    }, {
      "FileName": "Bedroom-2-1.jpg",
      "widthRatio": 2,
      "heightRatio": 2
    }, {
      "FileName": "MeetingRoom-0.jpg"
    }, {
      "FileName": "Restaurant-13.jpg"
    }
    ]
  }, {
    "Id": 28,
    "Hotel_Name": "Honolulu Inn",
    "Address": "822 Mauna Loa Rd",
    "Postal_Code": "96801",
    "Description": "Sun, sand and tropical breezes await you at the Honolulu Inn. Just 2 miles from the world famous Waikiki Beach, the hotel is nearby the famous Kona shopping center. We'll do everything we can to make your stay with us memorable.",
    "Hotel_Class": "Gold",
    "City": "Honolulu",
    "Price": 111,
    "Images": [{
      "FileName": "Honolulu-0.jpg"
    }, {
      "FileName": "Lobby-11.jpg"
    }, {
      "FileName": "Bedroom-4-0.jpg",
      "widthRatio": 2,
      "heightRatio": 2
    }, {
      "FileName": "Bathroom-2.jpg",
      "widthRatio": 2,
      "heightRatio": 2
    }, {
      "FileName": "Pool-14.jpg"
    }, {
      "FileName": "Restaurant-6.jpg"
    }
    ]
  }];
  currentHotel: any;
  constructor() {
    this.currentHotel = this.getFirstHotel();
  }

  ngOnInit(): void {
  }
  onGrdTransactionsContentReady(e) {

  }
  listSelectionChanged = (e) => {
    this.currentHotel = e.addedItems[0];
};
  getFirstHotel() {
    return this.dtsConversationa[0];
  }
}
